/*!
 * Copyright © 2025 Tanvir S.
 * All rights reserved.
 * 
 * This script is part of the Blogger project.
 * Distributed via: https://cdn.jsdelivr.net/gh/tanvirslayout/blogger@1.0.0/file/main.js
 * 
 * Unauthorized copying or distribution of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
if (
    (loadScript("https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js", { id: "paceJs", crossorigin: "anonymous", referrerpolicy: "no-referrer" }),
    document.querySelector(".header") &&
      (() => {
        let e = document.querySelector(".header"),
          t = 0;
        window.addEventListener("scroll", () => {
          let o = scrollY;
          e.classList.toggle("pin", o > 160 && o > t), e.classList.toggle("pinX", o > 160), (t = o);
        });
      })(),
    null !== document.querySelector(".BlogSearch"))
  ) {
    let e = document.querySelectorAll(".BlogSearch .buttons span"),
      t = document.querySelector(".BlogSearch .shortIi");
    e.forEach((o) => {
      o.addEventListener("click", () => {
        e.forEach((e) => e.classList.remove("selected")), o.classList.add("selected");
        let a = o.getAttribute("data-text");
        t.setAttribute("data-text", a);
        let n = o.getAttribute("data-value");
        t.setAttribute("data-value", n), (document.querySelector(".BlogSearch input.shortI").checked = !1), document.getElementById("search-action").focus();
      });
    }),
      document.getElementById("search-form").addEventListener("submit", function (e) {
        var o = document.getElementById("search-action").value,
          a = t.getAttribute("data-value");
        a && (o += " label:" + a), (document.getElementById("search-action").value = o);
      });
    let a = document.querySelectorAll(".BSAction"),
      n = document.querySelector("#search-action"),
      l = document.querySelector(".BlogSearch"),
      s = !1;
    a.forEach((e) => {
      e.addEventListener("click", () => {
        s ? (n.blur(), l.classList.remove("focus")) : (n.focus(), l.classList.add("focus")), (s = !s);
      });
    });
    let i = document.getElementById("search-action"),
      c = document.getElementById("result-span");
    c.addEventListener("click", () => {
      c.classList.add("hidden");
    }),
      i.addEventListener("input", () => {
        "" !== i.value.trim() ? c.classList.remove("hidden") : c.classList.add("hidden");
      });
  }
  if (
    (document.querySelector("time") &&
      (() => {
        function e() {
          document.querySelectorAll("time").forEach((e) => {
            e.textContent = (function (e) {
              let t = new Date(),
                o = new Date(e),
                a = Math.floor((t - o) / 1e3);
              for (let e of [
                { s: 31536e3, l: ["year", "years"] },
                { s: 2592e3, l: ["month", "months"] },
                { s: 604800, l: ["week", "weeks"] },
                { s: 86400, l: ["day", "days"] },
                { s: 3600, l: ["hour", "hours"] },
                { s: 60, l: ["minute", "minutes"] },
                { s: 1, l: ["second", "seconds"] },
              ]) {
                let t = Math.floor(a / e.s);
                if (t >= 1) return `${t} ${1 === t ? e.l[0] : e.l[1]} ago`;
              }
              return "just now";
            })(e.getAttribute("datetime"));
          });
        }
        e(), setInterval(e, 1e3);
      })(),
    null !== document.querySelector("#speak"))
  ) {
    let d,
      u = document.getElementById("speak"),
      m = document.getElementById("speakText"),
      h = !1;
    function r(e) {
      let t = "",
        o = document.createTreeWalker(
          e,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function (e) {
              let t = e.parentNode.tagName.toLowerCase();
              return "script" === t || "style" === t ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            },
          },
          !1
        );
      for (; o.nextNode(); ) t += o.currentNode.nodeValue.trim() + " ";
      return t.trim();
    }
    u.addEventListener("click", () => {
      if (h) speechSynthesis.cancel(), u.classList.remove("play"), (h = !1);
      else {
        let e = r(m);
        e &&
          (((d = new SpeechSynthesisUtterance(e)).onend = () => {
            u.classList.remove("play"), (h = !1);
          }),
          speechSynthesis.speak(d),
          u.classList.add("play"),
          (h = !0));
      }
    });
  }
  if (null !== document.querySelector("#read-time")) {
    function o(e) {
      let t = "",
        a = e.childNodes.length;
      for (let n = 0; n < a; n++) {
        let a = e.childNodes[n];
        8 !== a.nodeType && (t += 1 !== a.nodeType ? a.nodeValue : o(a));
      }
      return t;
    }
    let g,
      p = Math.round(o(document.querySelector(".docs")).split(" ").length / 200);
    (g = 0 === p || 1 === p ? "minute" : "minutes"), (document.getElementById("read-time").innerHTML = `${p} ${g}`);
  }
  if (
    (null !== document.querySelector(".copyShare") &&
      document.querySelector(".copyShare").addEventListener("click", function () {
        let e = this.getAttribute("data-url");
        navigator.clipboard.writeText(e).then(() => {
          let e = this.querySelector("span"),
            t = e.textContent;
          (e.textContent = "Link was copied"),
            setTimeout(() => {
              e.textContent = t;
            }, 1e3);
        });
      }),
    null !== document.querySelector(".likeI"))
  ) {
    const f = { blogID: "BLOG", databaseUrl: settings.firebaseUrl, abbreviation: !0 };
    function abvr(e) {
      const t = Math.sign(Number(e));
      return Math.abs(e) >= 1e9 ? t * (Math.abs(e) / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? t * (Math.abs(e) / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? t * (Math.abs(e) / 1e3).toFixed(2) + "K" : Math.abs(e);
    }
    function loadClickCounts() {
      const e = document.querySelectorAll(".likeI"),
        t = firebase.database();
      for (let o = 0; o < e.length; o++) {
        const a = e[o],
          n = a.getAttribute("data-id"),
          l = JSON.parse(localStorage.getItem("clickedPosts")) || {};
        t.ref(`BlogID_${f.blogID}/PostID_${n}/clicks`).once("value", (e) => {
          const t = e.exists() ? e.val() : 0;
          a.setAttribute("data-text", f.abbreviation ? abvr(t) : t), a.classList.remove("hidden"), l[n] && a.classList.add("clicked");
        });
      }
    }
    function incrementClickCount(e) {
      const t = firebase.database(),
        o = e.getAttribute("data-id"),
        a = t.ref(`BlogID_${f.blogID}/PostID_${o}/clicks`),
        n = JSON.parse(localStorage.getItem("clickedPosts")) || {};
      a.once("value", (t) => {
        let l = t.exists() ? t.val() : 0;
        l++,
          a.set(l).then(() => {
            e.setAttribute("data-text", f.abbreviation ? abvr(l) : l), n[o] || (e.classList.add("clicked"), (n[o] = !0), localStorage.setItem("clickedPosts", JSON.stringify(n)));
          });
      });
    }
    function initFirebaseAndLikes() {
      loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", { id: "firebaseApp", referrerpolicy: "no-referrer" })
        .then(() => loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js", { id: "firebaseData", referrerpolicy: "no-referrer" }))
        .then(() => {
          firebase.initializeApp({ databaseURL: f.databaseUrl }), "function" == typeof loadClickCounts && loadClickCounts();
        });
    }
    function onScroll() {
      0 !== window.scrollY && (localStorage.setItem("hasInteractedBefore", "true"), window.removeEventListener("scroll", onScroll), Defer(initFirebaseAndLikes));
    }
    localStorage.getItem("hasInteractedBefore") ? Defer(initFirebaseAndLikes) : window.addEventListener("scroll", onScroll, { passive: !0 });
  }
  function updateSaveButtons(e) {
    let t = document.querySelectorAll(`.save-this[data-postId='${e}']`),
      o = (JSON.parse(localStorage.getItem("bookmarkedPosts")) || []).includes(e);
    t.forEach((e) => {
      o ? e.classList.add("saved") : e.classList.remove("saved");
    });
  }
  function loadSavedPosts() {
    (JSON.parse(localStorage.getItem("bookmarkedPosts")) || []).forEach((e) => updateSaveButtons(e)), updateBookmarkCount();
  }
  function updateBookmarkCount() {
    let e = JSON.parse(localStorage.getItem("bookmarkedPosts")) || [];
    document.getElementById("post-count").setAttribute("data-text", e.length);
  }
  function initializeSaveButtons() {
    document.querySelectorAll(".save-this").forEach((e) => {
      e.addEventListener("click", () => {
        let t = e.getAttribute("data-postId"),
          o = JSON.parse(localStorage.getItem("bookmarkedPosts")) || [],
          a = o.indexOf(t);
        -1 === a ? o.push(t) : o.splice(a, 1), localStorage.setItem("bookmarkedPosts", JSON.stringify(o)), updateSaveButtons(t), updateBookmarkCount();
      });
    });
  }
  initializeSaveButtons(), loadSavedPosts();
  let paginationButton = document.querySelector(".pagination .button");
  null !== paginationButton &&
    paginationButton.addEventListener("click", function () {
      let e = this,
        t = e.getAttribute("data-action");
      t
        ? (e.classList.add("loading"),
          fetch(t)
            .then((e) => e.text())
            .then((t) => {
              let o = new DOMParser().parseFromString(t, "text/html"),
                a = Array.from(o.querySelectorAll(".stories.grid article"))
                  .map((e) => e.outerHTML)
                  .join("");
              document.querySelector(".stories.grid").innerHTML += a;
              let n = o.querySelector(".pagination .button[data-action]")?.getAttribute("data-action");
              n ? e.setAttribute("data-action", n) : document.querySelector(".pagination")?.setAttribute("hidden", "true"),
                e.classList.remove("loading"),
                initializeSaveButtons(),
                loadSavedPosts(),
                "function" == typeof loadClickCounts && loadClickCounts();
            })
            .catch((t) => {
              e.classList.remove("loading");
            }))
        : document.querySelector(".pagination")?.setAttribute("hidden", "true");
    });
  const forYouElement = document.querySelector(".forYou");
  forYouElement &&
    new IntersectionObserver(
      (e, t) => {
        e.forEach((e) => {
          if (e.isIntersecting) {
            let e = document.querySelector(".info .x .n a")?.dataset?.label;
            e &&
              (fetch(`/feeds/posts/default/-/${e}?alt=json`)
                .then((e) => e.json())
                .then((e) => {
                  let t = (e.feed.entry || []).map((e) => ({
                    title: e.title.$t,
                    link: e.link.find((e) => "alternate" === e.rel).href,
                    img: e.media$thumbnail ? e.media$thumbnail.url.replace(/\/s\d+-c/, "/s300-c") : settings.img1,
                    image2: e.media$thumbnail ? e.media$thumbnail.url.replace(/\/s\d+-c/, "/s4-c") : settings.imgP1,
                  }));
                  for (let e = t.length - 1; e > 0; e--) {
                    let o = Math.floor(Math.random() * (e + 1));
                    [t[e], t[o]] = [t[o], t[e]];
                  }
                  let o = t.slice(0, 4),
                    a = "";
                  o.forEach((e) => {
                    a += `<article class='flex align-center'><a class='nolight' href='${e.link}'><img class='lazyload' loading='lazy' src='${e.image2}' data-src='${e.img}' alt="${e.title}" width='65' height='65'/></a><h2 class='pFont fontsize16'><a href='${e.link}' rel="bookmark">${e.title}</a></h2></article>`;
                  }),
                    (forYouElement.innerHTML = a);
                })
                .catch((e) => {
                  forYouElement.innerHTML = "<div class='error'>Could not load related posts.</div>";
                }),
              t.unobserve(forYouElement));
          }
        });
      },
      { threshold: 0.1 }
    ).observe(forYouElement);
  const emptyMsgHTML =
    "<p class=\"PI sColor\">It looks like you haven't added anything yet. Don't leave this blank, <span class=\"fontw500 pColor\">add your favorite articles now.</span></p><a class='button big r gap16 fontw500 fontsize13 nolight' href='/'><span>Let's add one!</span><span class='mask arrow-right'/></a>";
  function loadBookmarkedPosts() {
    let e = document.getElementById("postContainer");
    if (!e) return;
    let t = JSON.parse(localStorage.getItem("bookmarkedPosts")) || [];
    0 !== t.length
      ? Promise.all(t.map((e) => fetch(`/feeds/posts/default/${e}?alt=json`).then((e) => e.json())))
          .then((t) => {
            let o = t.filter(Boolean);
            0 === o.length ? (e.innerHTML = emptyMsgHTML) : renderPosts(o);
          })
          .catch(() => {
            e.innerHTML = emptyMsgHTML;
          })
      : (e.innerHTML = emptyMsgHTML);
  }
  function renderPosts(e) {
    let t = document.getElementById("postContainer");
    (t.innerHTML = ""),
      e.forEach((e) => {
        let o = e.entry,
          a = o.title.$t,
          n = o.link.find((e) => "alternate" === e.rel).href,
          l = o.media$thumbnail ? o.media$thumbnail.url.replace(/\/s\d+-c/, "/s300-c") : settings.img1,
          s = o.media$thumbnail ? o.media$thumbnail.url.replace(/\/s\d+-c/, "/s4-c") : settings.imgP1,
          i = o.id.$t.split(".post-").pop(),
          r = document.createElement("article");
        (r.className = "bookmark-post inheritcolor"),
          (r.innerHTML = `<div class='img'><a class='nolight' href="${n}" aria-label="Thumbnail"><img class='lazyload' loading='lazy' src='${s}' data-src="${l}" width='65' height='65' alt="${a}"></a></div><div class="titleI"><h2><a href="${n}" rel="bookmark">${a}</a></h2></div><div class="deleteBtn flex place-center" data-postId="${i}"><svg class="line" viewBox="0 0 24 24"><path d="M 18.645 9.251 L 18.649 12.575 M 17.667 19.142 L 15.545 17.021 M 15.544 21.263 L 17.667 19.142 M 19.788 17.021 L 17.667 19.142 M 17.666 19.142 L 19.787 21.263 M 8.625 5.217 L 15.375 5.217 M 4.212 5.217 L 8.821 5.217 M 19.788 5.217 L 15.179 5.217 M 8.625 5.203 L 8.625 4.19 C 8.625 3.085 9.52 2.19 10.625 2.19 L 13.375 2.19 C 14.479 2.19 15.375 3.085 15.375 4.19 L 15.375 5.203 M 10.844 21.263 L 7.53 21.263 C 6.454 21.263 5.532 20.618 5.346 19.735 L 5.355 9.251"/></svg></div>`),
          t.appendChild(r),
          r.querySelector(".deleteBtn").addEventListener("click", () => {
            deletePost(i);
          });
      });
  }
  function deletePost(e) {
    let t = JSON.parse(localStorage.getItem("bookmarkedPosts")) || [];
    (t = t.filter((t) => t !== e)),
      localStorage.setItem("bookmarkedPosts", JSON.stringify(t)),
      document.querySelector(`.deleteBtn[data-postId='${e}']`)?.closest(".bookmark-post")?.remove(),
      updateBookmarkCount(),
      0 === t.length && (document.getElementById("postContainer").innerHTML = emptyMsgHTML);
  }
  if ((Defer(loadBookmarkedPosts), null !== document.querySelector(".filter"))) {
    const b = document.querySelector(".stories.grid"),
      v = document.querySelectorAll(".manage .button"),
      y = document.querySelector(".manage .all.button"),
      L = document.querySelector(".filterName"),
      k = b.innerHTML,
      S = document.querySelector(".pagination"),
      E = document.querySelector(".pagination .button:first-child");
    let C = null,
      w = "",
      x = [],
      M = 0;
    function showSkeletons() {
      clearPosts();
      for (let e = 0; e < 12; e++) {
        const e = document.createElement("div");
        (e.className = "skeleton flex column"), (e.innerHTML = '<div class="img"></div><div class="text i"></div><div class="text o"></div><div class="text u"></div>'), b.appendChild(e);
      }
    }
    function clearPosts() {
      (b.innerHTML = ""), b.classList.remove("nothing", "error"), C && C.remove();
    }
    function showNoPosts() {
      clearPosts(), b.classList.add("nothing");
    }
    function showError() {
      clearPosts(), b.classList.add("error");
    }
    function renderPosts() {
      const e = x
        .slice(M, M + 12)
        .map(createPostHTML)
        .join("");
      (b.innerHTML += e),
        (M += 12),
        initializeSaveButtons(),
        loadSavedPosts(),
        "undefined" != typeof firebase && firebase.apps?.length && "function" == typeof loadClickCounts && loadClickCounts(),
        C && (C.remove(), (C = null)),
        M < x.length &&
          ((C = document.createElement("button")),
          (C.className = "button big r nolight beforetext"),
          C.setAttribute("data-text", E.getAttribute("data-text")),
          S.appendChild(C),
          (C.onclick = () => {
            const e = C;
            e.classList.add("loading"),
              setTimeout(() => {
                renderPosts(), e.classList.remove("loading");
              }, 1500);
          }));
    }
    function createPostHTML(e) {
      const t = e.title?.$t || "Untitled",
        o = e.id?.$t?.split(".post-")[1],
        a = e.link?.find((e) => "alternate" === e.rel)?.href || "#",
        n = (e.category?.map((e) => e.term) || [])[0] || "",
        l = e.published?.$t || "",
        s = e.updated?.$t || l;
      let i = settings.img2,
        r = settings.imgP2;
      const c = e.media$thumbnail?.url || e.media$content?.[0]?.url;
      return (
        c && (i = c.replace(/\/s\d+-c/, "/w420-h236-p-k-no-nu")),
        c && (r = c.replace(/\/s\d+-c/, "/w8-h6-p-k-no-nu")),
        `<article><div class="thumbnail relative nolight"><a href="${a}"><img alt="${t}" width="420" height="236" class='lazyload' loading='lazy' src='${r}' data-src="${i}"></a><div class="book flex place-center absolute pBg"><span class="save-this cursorpointer" data-postid="${o}"><svg class="line" viewBox="0 0 24 24"><g><path d="M 12.898 5.49 L 16.505 5.49 M 20.111 5.49 L 16.505 5.49 M 16.505 5.49 L 16.505 1.884 M 16.505 5.49 L 16.505 9.097"></path><path d="M 19 12.566 L 19 21 L 13.082 17.195 C 12.423 16.771 11.577 16.771 10.918 17.195 L 5 21 L 5 5 C 5 3.896 5.896 3 7 3 L 9.913 3"></path></g><g class="hidden"><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0z" fill="currentColor"></path></g></svg></span></div></div><div class="i"><div class="nop sColor tFont fontsize13 flex align-center justify-between" style="margin-block:14px 10px"><time datetime="${s}"></time><a aria-label="Like" class="likeI gap6 flex place-center aftertext" data-id="${o}" data-text="--" href="${a}"><svg class="line" viewBox="0 0 24 24"><path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke-width="1.6"></path></svg></a></div><h2 class="title pFont LS"><a href="${a}" rel="bookmark">${t}</a></h2><footer class="fontsize12 sFont"><div class="tag beforetext" data-text="in"><a aria-label="${n}" class="beforetext" data-text="${n}" href="/search/label/${n}" rel="tag"></a></div></footer></div></article>`
      );
    }
    function setFilterLabel(e) {
      L.setAttribute("data-text", e || y.getAttribute("data-text")), localStorage.setItem("selectedLabel", e), (w = e);
    }
    function selectButton(e) {
      v.forEach((t) => {
        t.classList.toggle("selected", t.getAttribute("data-value") === e);
      });
    }
    function loadLabelPosts(e) {
      showSkeletons(),
        fetch(`/feeds/posts/default/-/${e}?alt=json`)
          .then((e) => e.json())
          .then((e) => {
            if (((x = e.feed.entry || []), (M = 0), 0 === x.length)) return showNoPosts();
            clearPosts(), renderPosts();
          })
          .catch(() => {
            showError();
          });
    }
    v.forEach((e) => {
      e.addEventListener("click", () => {
        document.getElementById("filterI").checked = !1;
        const t = e.getAttribute("data-value");
        setFilterLabel(t),
          selectButton(t),
          C && (C.remove(), (C = null)),
          t
            ? (E.setAttribute("hidden", "true"), loadLabelPosts(t))
            : (clearPosts(),
              (b.innerHTML = k),
              E.removeAttribute("hidden"),
              S.removeAttribute("hidden"),
              initializeSaveButtons(),
              loadSavedPosts(),
              "undefined" != typeof firebase && firebase.apps && firebase.apps.length && "function" == typeof loadClickCounts && loadClickCounts());
      });
    }),
      Defer(() => {
        const e = localStorage.getItem("selectedLabel") || "",
          t = document.querySelector(`.manage .button[data-value="${e}"]`);
        t && t.click();
      });
  }
  if (null !== document.querySelector(["code", ".pre-code"])) {
    let I = !1;
    function initializeHighlighting() {
      I ||
        ((I = !0),
        window.removeEventListener("scroll", initializeHighlighting),
        window.removeEventListener("click", initializeHighlighting),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js", { id: "highlightJs", crossorigin: "anonymous", referrerpolicy: "no-referrer" })
          .then(() => {
            document.querySelectorAll(["code", ".pre-code"]).forEach((e) => {
              hljs.highlightElement(e);
              let t = e.parentElement;
              if (t && "pre" === t.tagName.toLowerCase()) {
                let o = e.innerText.split("\n"),
                  a = document.createElement("div");
                (a.className = "line-numbers"), (a.innerHTML = o.map((e, t) => t + 1).join("<br>")), t.appendChild(a);
                let n = document.createElement("div");
                n.className = "btn-group";
                let l = document.createElement("button");
                (l.className = "btn"),
                  (l.textContent = "Copy"),
                  (l.onclick = () => {
                    navigator.clipboard.writeText(e.innerText).then(() => {
                      (l.textContent = "Copied!"), setTimeout(() => (l.textContent = "Copy"), 1500);
                    });
                  });
                let s = document.createElement("button");
                (s.className = "btn"),
                  (s.textContent = "Edit"),
                  (s.onclick = () => {
                    window
                      .open()
                      .document.write(
                        `<html><head><meta content='width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=5.0' name='viewport'/></head><body style="padding:24px;max-width:640px;margin:0 auto"><textarea style="width:100%;height:100%;font-family:monospace;padding:14px">${e.innerText}</textarea></body></html>`
                      );
                  }),
                  n.appendChild(l),
                  n.appendChild(s),
                  t.appendChild(n);
              }
            });
          })
          .catch((e) => {}));
    }
    window.addEventListener("scroll", initializeHighlighting), window.addEventListener("click", initializeHighlighting);
  }
  Defer(() => {
    const e = document.querySelector("body"),
      t = document.createElement("div");
    document.cookie
      .split("; ")
      .find((e) => e.startsWith("cookieConsent="))
      ?.split("=")[1] ||
      (t.classList.add("cookie", "flex", "column"),
      t.insertAdjacentHTML(
        "beforeend",
        '<p class="fontsize14 LS">We use cookies to understand preferences and optimize your experience using our site, this includes advertising affiliated with Google.</p><div class="flex align-center"><a class="button noH extralink nolight" href="https://policies.google.com/technologies/cookies" rel="nofollow noreferrer" target="_blank">Learn more</a><button class="accept button r noH noC black nolight">OK, got it.</button></div>'
      ),
      e.prepend(t),
      t.querySelector(".accept").addEventListener("click", () => {
        (document.cookie = "cookieConsent=true; max-age=2592000; path=/"), t.remove();
      }));
  }),
    settings.adsense &&
      (() => {
        let e = localStorage.getItem("lazyAdsense"),
          t = () => {
            loadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${settings.adsense}`, { id: "adsenseJs", crossorigin: "anonymous" });
          };
        if (1 != e) {
          let e = !1;
          window.addEventListener(
            "scroll",
            () => {
              0 === (document.documentElement.scrollTop || document.body.scrollTop) || e || (Defer(t), localStorage.setItem("lazyAdsense", 1), (e = !0));
            },
            !0
          );
        } else Defer(t);
      })(),
    null !== document.querySelector(".tableOfContents") &&
      Defer(() => {
        class e {
          constructor({ from: e, to: t }) {
            (this.fromElement = e), (this.toElement = t), (this.headingElements = this.fromElement.querySelectorAll("h1, h2, h3, h4, h5, h6")), (this.tocElement = document.createElement("div"));
          }
          getMostImportantHeadingLevel() {
            let t = 6;
            for (let o = 0; o < this.headingElements.length; o++) {
              let a = e.getHeadingLevel(this.headingElements[o]);
              t = a < t ? a : t;
            }
            return t;
          }
          static generateId(e) {
            return e.textContent.replace(/\s+/g, "_");
          }
          static getHeadingLevel(e) {
            switch (e.tagName.toLowerCase()) {
              case "h1":
              default:
                return 1;
              case "h2":
                return 2;
              case "h3":
                return 3;
              case "h4":
                return 4;
              case "h5":
                return 5;
              case "h6":
                return 6;
            }
          }
          generateToc() {
            let t = this.getMostImportantHeadingLevel() - 1,
              o = this.tocElement;
            for (let a = 0; a < this.headingElements.length; a++) {
              let n = this.headingElements[a],
                l = e.getHeadingLevel(n),
                s = l - t,
                i = document.createElement("a");
              if ((n.id || (n.id = e.generateId(n)), (i.href = `#${n.id}`), (i.textContent = n.textContent), s > 0)) {
                for (let e = 0; e < s; e++) {
                  let e = document.createElement("ol"),
                    t = document.createElement("li");
                  e.appendChild(t), o.appendChild(e), (o = t);
                }
                o.appendChild(i);
              } else {
                for (let e = 0; e < -s; e++) o = o.parentNode.parentNode;
                let e = document.createElement("li");
                e.appendChild(i), o.parentNode.appendChild(e), (o = e);
              }
              t = l;
            }
            this.toElement.appendChild(this.tocElement.firstChild);
          }
        }
        new e({ from: document.querySelector(".docs"), to: document.querySelector(".tableOfContents") }).generateToc();
      }),
    Defer(() => {
      loadScript("https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js", { id: "lazysizesJs", crossorigin: "anonymous", referrerpolicy: "no-referrer" });
    }, 200);
