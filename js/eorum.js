const extensions = Object.freeze({
  links: "bdf623e6-a4a7-43a9-b843-00b91eee8b76"
});

function parseAccount(account) {
  const parts = account.split("@", 2);
  if (parts.length !== 2) {
    throw TypeError("invalid account: no '@' found in " + account);
  }
  return parts;
}

function fetchJSON(url, accept = "application/json") {
  return fetch(url, { headers: { "Accept": accept } })
    .then(r => r.json());
}

function parseDNSJSON(dns) {
  if (dns.Answer === undefined) {
    throw new Error("unable to resolve " + domain);
  }
  const [ ,  , port, target] = dns.Answer[0].data.split(" ", 4);
  if (port === undefined || target === undefined) {
    throw new Error("unable to parse reply");
  }
  return port === 443 ? target : target + ":" + String(port)
}

function resolve(name, type) {
  // https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/
  const url = "https://cloudflare-dns.com/dns-query?" + new URLSearchParams({ name, type }).toString();

  return fetchJSON(url, "application/dns-json")
    .then(parseDNSJSON);
}

function lookup(account) {
  const [ , domain] = parseAccount(account);

  return resolve("_eorum._tcp." + domain, "SRV")
    .then(domain => fetchJSON("https://" + domain + "/" + account))
    .catch(error => { return { [account]: { error } } });
}

export default { lookup, extensions };