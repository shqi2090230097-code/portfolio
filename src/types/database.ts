export type ProjectStatus = 'draft' | 'published';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ProjectRow { id:string;title:string;subtitle:string|null;slug:string;cover_image:Json|null;category:string;year:number;client:string|null;role:string|null;duration:string|null;summary:string;description:string|null;featured:boolean;status:ProjectStatus;sort_order:number;theme_background:string|null;created_at:string;updated_at:string }
export type ProjectInsert={title:string;subtitle?:string|null;slug:string;cover_image?:Json|null;category:string;year:number;client?:string|null;role?:string|null;duration?:string|null;summary:string;description?:string|null;featured?:boolean;status?:ProjectStatus;sort_order?:number;theme_background?:string|null;id?:string;created_at?:string;updated_at?:string};
export type ProjectUpdate=Partial<ProjectInsert>;
export interface ProjectBlockRow {id:string;project_id:string;type:string;content:Json;sort_order:number;created_at:string;updated_at:string}
export type ProjectBlockInsert={project_id:string;type:string;content:Json;sort_order:number;id?:string;created_at?:string;updated_at?:string};
export type ProjectBlockUpdate=Partial<ProjectBlockInsert>;
export interface Database { public:{ Tables:{
  projects:{Row:ProjectRow;Insert:ProjectInsert;Update:ProjectUpdate;Relationships:[]};
  project_blocks:{Row:ProjectBlockRow;Insert:ProjectBlockInsert;Update:ProjectBlockUpdate;Relationships:[{foreignKeyName:'project_blocks_project_id_fkey';columns:['project_id'];isOneToOne:false;referencedRelation:'projects';referencedColumns:['id']}]};
};Views:Record<string,never>;Functions:Record<string,never>;Enums:Record<string,never>;CompositeTypes:Record<string,never>} }
