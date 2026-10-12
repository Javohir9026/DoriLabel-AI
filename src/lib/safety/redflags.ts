const patterns = [
  /ko['’`]?krak og['’`]?rig/i, /nafas\w*\s+qis/i, /hushdan ket/i, /kuchli qon ket/i, /yuz qiyshay/i, /nutq buz/i, /falaj/i, /talvasa/i, /zaharlan/i, /o['’`]?zimni o['’`]?ldir|o['’`]?lgim kel/i,
  /боль в груди/i, /не могу дышать|трудно дышать/i, /хочу умереть/i,
  /дарди қафаси сина/i, /нафас(?:кашӣ)? душвор/i, /беҳуш/i, /хунравии шадид/i, /худкуш/i, /заҳролуд/i,
  /chest pain/i, /shortness of breath/i, /faint(ed|ing)?/i, /heavy bleeding/i, /suicid/i, /poison/i,
];

export const hasRedFlag = (value: string) => patterns.some((pattern) => pattern.test(value));
