// Clarity / Yahoo beacons. Placeholders from the integration notes are
// filled with values from the listings XML.

const jsStr = (s) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ')
    .replace(/</g, '\\x3c');

export function beaconHtml(tokens, sourceTag) {
  const { searchId, clientId, impressionGuid, rguid } = tokens;
  const src = encodeURIComponent(sourceTag);
  return `<script>
    (function(w,d,t,x,m,l,p){w['XMLPlusSTObject']=m;w[m]=w[m]||function(){(w[m].q=w[m].q||[]).push(arguments)},w[m].l=1*new Date();
        l=d.createElement(t),p=d.getElementsByTagName(t)[0];
        l.type="text/javascript";l.async=1;l.defer=0;l.src=x;p.parentNode.insertBefore(l,p)})
    (window,document,'script','https://s.yimg.com/ds/scripts/selectTier-v1.1.0.js','selectTier');

    selectTier('init',{source_tag:'${jsStr(sourceTag)}',ysid:'${jsStr(searchId)}',cid:'${jsStr(clientId)}',ig:'${jsStr(impressionGuid)}',
        select_tier:{clarityId:'syd2j7szox',rguid:'${jsStr(rguid)}'},test_mode:false});
</script>
<img height="1" width="1" alt="" src="https://search.yahoo.com/beacon/geop/p?s=1197774733&amp;ysid=${encodeURIComponent(searchId)}&amp;traffic_source=${src}"/>`;
}

// Safe for embedding JSON inside an inline <script>.
export const safeJson = (o) =>
  JSON.stringify(o)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
