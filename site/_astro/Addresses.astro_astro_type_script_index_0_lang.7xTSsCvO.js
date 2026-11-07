const p="https://api.ai-robots.ai";document.addEventListener("astro:page-load",()=>{const s=document.getElementById("addresses-container"),t=document.getElementById("addresses-list");!s||!t||y(s,t)});function f(s){const t=document.cookie.match(new RegExp("(^| )"+s+"=([^;]+)"));return t?t[2]:null}function a(s){return s&&String(s).trim()?String(s):"-"}async function y(s,t){const n=f("ia_access_token");if(!n){window.location.href="/access/signin";return}try{const d=await fetch(`${p}/api/account/addresses`,{headers:{Authorization:`Bearer ${n}`}});if(d.status===401){document.cookie="ia_access_token=; path=/; max-age=0",localStorage.removeItem("ia_customer_firstName"),window.location.href="/access/signin";return}if(!d.ok){t.innerHTML='<p class="paragraph-1 color-white" style="text-align:center;">Failed to load addresses.</p>';return}const m=await d.json(),v=m?.defaultAddress?.id||null,h=m?.addresses?.edges||[];if(h.length===0){s.innerHTML=`
          <div class="no-addresses">
            <p>No addresses saved yet!</p>
            <button class="add-new open-sidemenu-btn add-address-menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                <rect x="0.5" width="16" height="16" rx="8" fill="var(--MAIN-BLUE)"></rect>
                <path d="M8.875 4.25V11.5M5.25 7.875H12.5" stroke="white" stroke-width="1.03571" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              add new address
            </button>
          </div>`;const i=s.querySelector(".add-address-menu"),e=document.getElementById("overlay-add");i?.addEventListener("click",()=>{e?.classList.remove("hidden")});return}t.innerHTML=h.map(i=>{const e=i.node,o=e.id===v;return`
          <div class="address-box" data-address-id="${e.id||""}">
            <label class="default-radio-label ${o?"is-default":""}" style="color: white;">
              <input type="radio" name="default-address" value="${e.id||""}" ${o?"checked":""} />
              <span class="default-radio-text">${o?"Default":"Set as default"}</span>
            </label>
            <div class="items">
              <div style="grid-column:span 2">
                <span>First Name</span>
                <p>${a(e.firstName)}</p>
              </div>
              <div style="grid-column:span 2">
                <span>Last Name</span>
                <p>${a(e.lastName)}</p>
              </div>
              <div style="grid-column:span 2">
                <span>Country</span>
                <p>${a(e.country)}</p>
              </div>
              <div style="grid-column:span 2">
                <span>City</span>
                <p>${a(e.city)}</p>
              </div>
              <div style="grid-column:span 2">
                <span>Province</span>
                <p>${a(e.province)}</p>
              </div>
              <div style="grid-column:span 4">
                <span>Address Line</span>
                <p>${a(e.address1)}</p>
              </div>
              <div style="grid-column:span 4">
                <span>Additional Address Line</span>
                <p>${a(e.address2)}</p>
              </div>
              <div style="grid-column:span 2">
                <span>Postal Code</span>
                <p>${a(e.zip)}</p>
              </div>
              <div style="grid-column:span 2">
                <span>Phone</span>
                <p>${a(e.phone)}</p>
              </div>
            </div>
            <div class="btns">
              <button class="open-sidemenu-btn edit-address-menu" data-id="${e.id||""}">edit</button>
              <button class="remove-address-btn" data-id="${e.id||""}">remove</button>
            </div>
          </div>`}).join(""),t.querySelectorAll('input[name="default-address"]').forEach(i=>{i.addEventListener("change",async e=>{const o=e.target,u=o.value;if(!u)return;const c=o.closest(".default-radio-label");if(c&&c.classList.add("radio-loading"),await k(u))t.querySelectorAll(".default-radio-label").forEach(r=>{const g=r.querySelector("input"),l=r.querySelector(".default-radio-text");g.value===u?(r.classList.add("is-default"),r.classList.remove("radio-loading"),l&&(l.textContent="Default")):(r.classList.remove("is-default"),g.checked=!1,l&&(l.textContent="Set as default"))});else{c&&c.classList.remove("radio-loading");const r=t.querySelector(`input[name="default-address"][value="${v}"]`);r&&(r.checked=!0),o.checked=!1}})}),t.querySelectorAll(".remove-address-btn").forEach(i=>{i.addEventListener("click",async()=>{const e=i.dataset.id;!e||!confirm("Remove this address?")||await w(e)})})}catch{t.innerHTML='<p class="paragraph-1 color-white" style="text-align:center;">Connection error loading addresses.</p>'}}async function w(s){const t=f("ia_access_token");if(t)try{const n=await fetch(`${p}/api/account/address`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({addressId:s})});if(n.ok)window.location.reload();else{const d=await n.json();alert(d?.message||"Failed to remove address.")}}catch{alert("Connection error.")}}async function k(s){const t=f("ia_access_token");if(!t)return!1;try{const n=await fetch(`${p}/api/account/default-address`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({addressId:s})});if(n.ok)return!0;const d=await n.json();return alert(d?.message||"Failed to set default address."),!1}catch{return alert("Connection error."),!1}}
