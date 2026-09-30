// Shared timing and simulation constants. CSS tokens are derived in tokens.mjs.
export const motion = {
  fast: 200, medium: 400, page: 550,
  weighted: 'cubic-bezier(.4, 0, .1, 1)', soft: 'cubic-bezier(.16, 1, .3, 1)',
  scrollSmoothing: .105, cursorSmoothing: .16, menuStagger: 45, titleDelay: 80,
  field: { desktop: 280, laptop: 210, mobile: 80, dpr: 1.75, mobileDpr: 1.5,
    spring: .018, damping: .88, gravity: .025, repulsion: 1.5, radius: 115,
    colors: ['#121416','#35383E','#70757D','#B7BCC7','#D3D7E1'],
    accents: ['#1A2FFB','#438B60','#C44848','#7854A8'], accentRatio: .2 },
};
