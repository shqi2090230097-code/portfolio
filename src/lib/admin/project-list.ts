import { getSupabaseBrowserClient } from '../supabase/browser';
import type { ProjectRow } from '../../types/database';

const client=getSupabaseBrowserClient();
const root=document.querySelector<HTMLElement>('[data-project-list]');
const newButton=document.querySelector<HTMLButtonElement>('[data-new-project]');
const format=(value:string)=>new Intl.DateTimeFormat('zh-CN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
const slugify=(value:string)=>value.toLowerCase().trim().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||`project-${Date.now()}`;

async function load(){
  if(!client||!root)return;
  const {data,error}=await client.from('projects').select('*').order('sort_order');
  if(error){root.innerHTML=`<div class="admin-empty admin-error">加载失败：${error.message}</div>`;return;}
  render(data??[]);
}
function button(label:string,action:string,id:string){const el=document.createElement('button');el.type='button';el.className='admin-icon-button';el.textContent=label;el.dataset.action=action;el.dataset.id=id;return el;}
function render(projects:ProjectRow[]){
  if(!root)return;root.replaceChildren();
  if(!projects.length){root.innerHTML='<div class="admin-empty">还没有作品。点击“新建作品”开始。</div>';return;}
  const table=document.createElement('div');table.className='admin-table';
  const head=document.createElement('div');head.className='admin-row admin-row--head';head.innerHTML='<span></span><span>封面</span><span>项目</span><span>分类</span><span>年份</span><span>状态</span><span>更新时间</span><span></span>';table.append(head);
  projects.forEach(project=>{
    const row=document.createElement('div');row.className='admin-row';row.draggable=true;row.dataset.id=project.id;
    const handle=document.createElement('span');handle.className='admin-handle';handle.textContent='⋮⋮';
    const img=document.createElement('img');img.className='admin-thumb';img.alt='';const cover=project.cover_image as {url?:string}|null;if(cover?.url)img.src=cover.url;
    const title=document.createElement('div');title.className='admin-title-wrap';const strong=document.createElement('div');strong.className='admin-title';strong.textContent=project.title;const slug=document.createElement('div');slug.className='admin-slug';slug.textContent=`/${project.slug}`;title.append(strong,slug);
    const category=document.createElement('span');category.textContent=project.category;const year=document.createElement('span');year.textContent=String(project.year);
    const status=document.createElement('span');status.className=`admin-status admin-status--${project.status}`;status.textContent=project.status==='published'?'已发布':'草稿';
    const updated=document.createElement('span');updated.className='admin-muted';updated.textContent=format(project.updated_at);
    const actions=document.createElement('div');actions.className='admin-actions';const edit=document.createElement('a');edit.className='admin-icon-button';edit.href=`/admin/projects/${project.id}`;edit.textContent='编辑';actions.append(edit,button('复制','duplicate',project.id),button(project.status==='published'?'下架':'发布','toggle',project.id),button('删除','delete',project.id));
    row.append(handle,img,title,category,year,status,updated,actions);table.append(row);
  });root.append(table);bind(table);
}
function bind(table:HTMLElement){
  let dragged:HTMLElement|null=null;
  table.querySelectorAll<HTMLElement>('.admin-row[draggable]').forEach(row=>{
    row.addEventListener('dragstart',()=>{dragged=row;row.classList.add('is-dragging');});row.addEventListener('dragend',async()=>{row.classList.remove('is-dragging');dragged=null;const rows=[...table.querySelectorAll<HTMLElement>('.admin-row[draggable]')];await Promise.all(rows.map((item,index)=>client!.from('projects').update({sort_order:index}).eq('id',item.dataset.id!)));});
    row.addEventListener('dragover',event=>{event.preventDefault();if(!dragged||dragged===row)return;const box=row.getBoundingClientRect();table.insertBefore(dragged,event.clientY<box.top+box.height/2?row:row.nextSibling);});
  });
  table.addEventListener('click',async event=>{const target=(event.target as Element).closest<HTMLButtonElement>('button[data-action]');if(!target||!client)return;const id=target.dataset.id!,action=target.dataset.action;
    if(action==='delete'){if(!confirm('确定删除这个项目及其全部模块吗？此操作不可撤销。'))return;const {error}=await client.from('projects').delete().eq('id',id);if(error)alert(error.message);else await load();}
    if(action==='toggle'){const current=target.textContent==='下架';const {error}=await client.from('projects').update({status:current?'draft':'published'}).eq('id',id);if(error)alert(error.message);else await load();}
    if(action==='duplicate'){const {data:source,error}=await client.from('projects').select('*, project_blocks(*)').eq('id',id).single();if(error||!source){alert(error?.message??'复制失败');return;}const {project_blocks,...base}=source;const {id:_id,created_at:_c,updated_at:_u,...copy}=base;const {data:created,error:createError}=await client.from('projects').insert({...copy,title:`${copy.title} 副本`,slug:`${copy.slug}-copy-${Date.now().toString().slice(-5)}`,status:'draft',sort_order:999}).select().single();if(createError||!created){alert(createError?.message??'复制失败');return;}if(project_blocks.length)await client.from('project_blocks').insert(project_blocks.map(({id:_b,created_at:_bc,updated_at:_bu,...block}:any)=>({...block,project_id:created.id})));location.assign(`/admin/projects/${created.id}`);}
  });
}
newButton?.addEventListener('click',async()=>{if(!client)return;const now=new Date();const title='未命名项目';const {data,error}=await client.from('projects').insert({title,subtitle:null,slug:slugify(`${title}-${Date.now()}`),cover_image:null,category:'未分类',year:now.getFullYear(),client:null,role:null,duration:null,summary:'请填写项目简介',description:null,featured:false,status:'draft',sort_order:999,theme_background:null}).select().single();if(error||!data){alert(error?.message??'创建失败');return;}location.assign(`/admin/projects/${data.id}`);});
void load();

