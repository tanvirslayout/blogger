const D = document,
  W = window,
  S = localStorage,
  $ = (e) => D.querySelector(e),
  $$ = (e) => [...D.querySelectorAll(e)],
  setA = (e, t, a) => e.setAttribute(t, a),
  getA = (e, t) => e.getAttribute(t),
  aClass = (e, t) => e.classList.add(t),
  rClass = (e, t) => e.classList.remove(t),
  header = $(".header"),
  BlogSearch = $(".BlogSearch"),
  time = $("time"),
  book = $("#post-count"),
  like = $(".likeI"),
  pagination = $(".pagination"),
  speak = $("#speak"),
  readTime = $("#read-time"),
  share = $(".copyShare"),
  preCode = $(".pre code, code");
(comment = $(".commentForm")), (consentBanner = $(".cookie")), (forYouElement = $(".forYou")), (tableOfContents = $(".tableOfContents")), (bookPost = $("#postContainer")), (filterPost = $(".filter .manage .button"));

function dark() {
  const t = document.documentElement;
  t.classList.toggle("dark"), t.classList.contains("dark") ? S.setItem("theme", "dark") : S.setItem("theme", "light");
}

if (!0 === settings.loadingAnimation) {
  function e() {
    const e = D.createElement("div");
    (e.className = "pageLoading"),
      (e.innerHTML = "<div></div>"),
      D.body.appendChild(e),
      setTimeout(() => {
        e.remove();
      }, 6e3);
  }
  D.addEventListener("click", (t) => {
    const a = t.target.closest("a");
    a && "_blank" !== a.target && a.href && (t.preventDefault(), e(), (W.location.href = a.href));
  }),
    W.addEventListener("beforeunload", () => {
      e();
    });
}

function loadJS(e, t = {}) {
  return new Promise((o, r) => {
    const n = D.createElement("script");
    (n.src = e), (n.async = !0);
    for (const [e, o] of Object.entries(t)) n.setAttribute(e, o);
    (n.onload = o), (n.onerror = r), D.head.appendChild(n);
  });
}
function Observe(e, r) {
  let [o, t, n] = Array.isArray(r) ? r : [r, void 0, "object" == typeof r ? r : void 0];
  const { rootMargin: s = "0px" } = n || {},
    i = new IntersectionObserver(
      (r, o) => {
        r.forEach((r) => {
          r.isIntersecting && (t ? setTimeout(() => e(r), t) : e(r), o.unobserve(r.target));
        });
      },
      { rootMargin: s }
    );
  "string" == typeof o
    ? document.querySelectorAll(o).forEach((e) => i.observe(e))
    : o instanceof Element
    ? i.observe(o)
    : (o instanceof NodeList || Array.isArray(o)) &&
      o.forEach((e) => {
        e instanceof Element && i.observe(e);
      });
}
(() => {
  let e = "hasLazyLoaded",
    t = "true" === S.getItem(e);
  W.Lazy = function (o) {
    if (t) return void o();
    let r = !1;
    function n() {
      r || ((r = !0), S.setItem(e, "true"), s.forEach((e) => W.removeEventListener(e, n)), o());
    }
    let s = ["touchstart", "mousemove", "mousedown", "keydown", "wheel"];
    s.forEach((e) => W.addEventListener(e, n, { once: !0 }));
  };
})();

//header
if (header) {
  let e = header,
    t = 0;
  W.addEventListener("scroll", () => {
    let a = scrollY;
    e.classList.toggle("pin", a > 160 && a > t), e.classList.toggle("pinX", a > 160), (t = a);
  });
}

// search
if (BlogSearch) {
  let e = $$(".BlogSearch .buttons span"),
    t = $(".BlogSearch .shortIi");
  e.forEach((a) => {
    a.addEventListener("click", () => {
      e.forEach((e) => rClass(e, "selected")), aClass(a, "selected");
      let s = getA(a, "data-text");
      setA(t, "data-text", s);
      let n = getA(a, "data-value");
      setA(t, "data-value", n), ($(".BlogSearch input.shortI").checked = !1), $("#search-action").focus();
    });
  }),
    $("#search-form").addEventListener("submit", function (e) {
      var a = $("#search-action").value,
        s = getA(t, "data-value");
      s && (a += " label:" + s), ($("#search-action").value = a);
    });
  let a = $$(".BSAction"),
    s = $("#search-action"),
    n = BlogSearch,
    l = !1;
  a.forEach((e) => {
    e.addEventListener("click", () => {
      l ? (s.blur(), rClass(n, "focus")) : (s.focus(), aClass(n, "focus")), (l = !l);
    });
  });
  let i = $("#search-action"),
    d = $("#result-span");
  d.addEventListener("click", () => {
    aClass(d, "hidden");
  }),
    i.addEventListener("input", () => {
      "" !== i.value.trim() ? rClass(d, "hidden") : aClass(d, "hidden");
    });
}

//time
if (time) {
  function e() {
    $$("time").forEach((e) => {
      e.textContent = (function (e) {
        let t = new Date(),
          a = new Date(e),
          s = Math.floor((t - a) / 1e3);
        for (let e of [
          { s: 31536e3, l: ["year", "years"] },
          { s: 2592e3, l: ["month", "months"] },
          { s: 604800, l: ["week", "weeks"] },
          { s: 86400, l: ["day", "days"] },
          { s: 3600, l: ["hour", "hours"] },
          { s: 60, l: ["minute", "minutes"] },
          { s: 1, l: ["second", "seconds"] },
        ]) {
          let t = Math.floor(s / e.s);
          if (t >= 1) return `${t} ${1 === t ? e.l[0] : e.l[1]} ago`;
        }
        return "just now";
      })(getA(e, "datetime"));
    });
  }
  e(), setInterval(e, 1e3);
}

//book
if (book) {
  function updateSaveButtons(e) {
    let t = $$(`.save-this[data-postId='${e}']`),
      a = (JSON.parse(S.getItem("bookmarkedPosts")) || []).includes(e);
    t.forEach((e) => {
      a ? aClass(e, "saved") : rClass(e, "saved");
    });
  }
  function loadSavedPosts() {
    (JSON.parse(S.getItem("bookmarkedPosts")) || []).forEach((e) => updateSaveButtons(e)), updateBookmarkCount();
  }
  function updateBookmarkCount() {
    let e = JSON.parse(S.getItem("bookmarkedPosts")) || [];
    $("#post-count").setAttribute("data-text", e.length);
  }
  function initializeSaveButtons() {
    $$(".save-this").forEach((e) => {
      e.addEventListener("click", () => {
        let t = getA(e, "data-postId"),
          a = JSON.parse(S.getItem("bookmarkedPosts")) || [],
          s = a.indexOf(t);
        -1 === s ? a.push(t) : a.splice(s, 1), S.setItem("bookmarkedPosts", JSON.stringify(a)), updateSaveButtons(t), updateBookmarkCount();
      });
    });
  }
  initializeSaveButtons(), loadSavedPosts();
}

//like
if (like) {
  const m = { blogID: "BLOG", databaseUrl: settings.firebaseUrl, abbreviation: !0 };
  function abvr(e) {
    const t = Math.sign(Number(e));
    return Math.abs(e) >= 1e9 ? t * (Math.abs(e) / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? t * (Math.abs(e) / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? t * (Math.abs(e) / 1e3).toFixed(2) + "K" : Math.abs(e);
  }
  function loadClickCounts() {
    const e = $$(".likeI"),
      t = firebase.database();
    for (let a = 0; a < e.length; a++) {
      const s = e[a],
        n = getA(s, "data-id"),
        o = JSON.parse(S.getItem("clickedPosts")) || {};
      t.ref(`BlogID_${m.blogID}/PostID_${n}/clicks`).once("value", (e) => {
        const t = e.exists() ? e.val() : 0;
        setA(s, "data-text", m.abbreviation ? abvr(t) : t), o[n] && aClass(s, "clicked");
      });
    }
  }
  function incrementClickCount(e) {
    const t = firebase.database(),
      a = getA(e, "data-id"),
      s = t.ref(`BlogID_${m.blogID}/PostID_${a}/clicks`),
      n = JSON.parse(S.getItem("clickedPosts")) || {};
    s.once("value", (t) => {
      let o = t.exists() ? t.val() : 0;
      o++,
        s.set(o).then(() => {
          setA(e, "data-text", m.abbreviation ? abvr(o) : o), n[a] || (aClass(e, "clicked"), (n[a] = !0), S.setItem("clickedPosts", JSON.stringify(n)));
        });
    });
  }

  Lazy(function () {
    loadJS("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
    loadJS("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js").then(() => {
      firebase.initializeApp({ databaseURL: m.databaseUrl });
      if (typeof loadClickCounts === "function") {
        loadClickCounts();
      }
    });
  });
}

//pagination
if (pagination) {
  let paginationButton = $(".pagination .button");
  paginationButton.addEventListener("click", function () {
    let e = this,
      t = getA(e, "data-action");
    t
      ? (aClass(e, "loading"),
        fetch(t)
          .then((e) => e.text())
          .then((t) => {
            let a = new DOMParser().parseFromString(t, "text/html"),
              s = Array.from(a.querySelectorAll(".stories.grid article"))
                .map((e) => e.outerHTML)
                .join("");
            $(".stories.grid").innerHTML += s;
            let n = a.querySelector(".pagination .button[data-action]")?.getAttribute("data-action");
            n ? setA(e, "data-action", n) : pagination?.setAttribute("hidden", "true"), aClass(e, "loading"), initializeSaveButtons(), loadSavedPosts(), "function" == typeof loadClickCounts && loadClickCounts();
          })
          .catch((t) => {
            aClass(e, "loading");
          }))
      : pagination?.setAttribute("hidden", "true");
  });
}

//script
if (settings.analytics) {
  Lazy(() => {
    (window.dataLayer = window.dataLayer || []), window.dataLayer.push(["js", new Date()]), window.dataLayer.push(["config", settings.analytics]), loadJS(`https://www.googletagmanager.com/gtag/js?id=${settings.analytics}`);
  });
}
if (settings.adsense) {
  Lazy(() => {
    loadJS(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${settings.adsense}`, { crossorigin: "anonymous" });
  });
}
//cokie
if (consentBanner) {
  if (!document.cookie.split("; ").find((cookie) => cookie.startsWith("cookieConsent="))) {
    rClass(consentBanner, "hidden");
    consentBanner.querySelector(".accept").addEventListener("click", () => {
      document.cookie = "cookieConsent=true; max-age=2592000; path=/";
      aClass(consentBanner, "hidden");
    });
  }
}

//speak
if (speak) {
  let c,
    h = speak,
    u = $(".docs"),
    p = !1;
  function r(e) {
    let t = "",
      a = D.createTreeWalker(
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
    for (; a.nextNode(); ) t += a.currentNode.nodeValue.trim() + " ";
    return t.trim();
  }
  h.addEventListener("click", () => {
    if (p) speechSynthesis.cancel(), rClass(h, "play"), (p = !1);
    else {
      let e = r(u);
      e &&
        (((c = new SpeechSynthesisUtterance(e)).onend = () => {
          rClass(h, "play"), (p = !1);
        }),
        speechSynthesis.speak(c),
        aClass(h, "play"),
        (p = !0));
    }
  });
}

//readTime
if (readTime) {
  function o(e) {
    let t = "",
      a = e.childNodes.length;
    for (let s = 0; s < a; s++) {
      let a = e.childNodes[s];
      8 !== a.nodeType && (t += 1 !== a.nodeType ? a.nodeValue : o(a));
    }
    return t;
  }
  let g,
    f = Math.round(o($(".docs")).split(" ").length / 200);
  (g = 0 === f || 1 === f ? "minute" : "minutes"), (readTime.innerHTML = `${f} ${g}`);
}

//share
if (share) {
  share.addEventListener("click", function () {
    let e = getA(this, "data-url");
    navigator.clipboard.writeText(e).then(() => {
      let e = this.querySelector("span"),
        t = e.textContent;
      (e.textContent = "Link was copied"),
        setTimeout(() => {
          e.textContent = t;
        }, 1e3);
    });
  });
}

//code
if (preCode) {
  Lazy(() => {
    loadJS("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js").then(() => {
      $$("pre code, code").forEach((e) => {
        hljs.highlightElement(e);
      });
    });

    const a = $$(".codeCopy");

    if (a.length > 0) {
      a.forEach((b) => {
        b.addEventListener("click", () => {
          const w = b.closest(".pre")?.querySelector("code");

          if (w) {
            const c = w.innerText;

            navigator.clipboard.writeText(c).then(() => {
              const o = b.textContent;
              b.textContent = "Copied";

              setTimeout(() => {
                b.textContent = o;
              }, 1500);
            });
          }
        });
      });
    }
  });
}

//comment
if (comment) {
  Observe(() => {
    const t = comment.getAttribute("data-iframe"),
      e = comment.getAttribute("data-src"),
      n = comment.getAttribute("data-script"),
      c = document.createElement("iframe");
    (c.id = "comment-editor"),
      (c.loading = "lazy"),
      (c.src = t),
      (c.title = "Blogger comment"),
      (c.onload = () => {
        const e = $(".commentForm"),
          n = $(".comment .u"),
          c = $("#comment-editor"),
          m = t,
          o = $$(".reply-button"),
          d = $("#postOwnComment");
        o.forEach((t) => {
          t.addEventListener("click", () => {
            const n = t.dataset.replyid,
              o = D.querySelector(`li[data-id="${n}"]`),
              d = `${m}&parentID=${n}`;
            (c.src = d), o.appendChild(e);
          });
        }),
          d.addEventListener("click", () => {
            (c.src = m), n.prepend(e);
          });
      }),
      comment.appendChild(c);
    const m = document.createElement("script");
    (m.src = e),
      (m.onload = () => {
        const t = document.createElement("script");
        (t.textContent = n), comment.appendChild(t);
      }),
      comment.appendChild(m);
  }, [comment, 100]);
}

//table of contents
if (tableOfContents) {
  class e {
    constructor({ from: e, to: t }) {
      (this.fromElement = e), (this.toElement = t), (this.headingElements = this.fromElement.querySelectorAll("h1, h2, h3, h4, h5, h6")), (this.tocElement = document.createElement("div"));
    }
    getMostImportantHeadingLevel() {
      let t = 6;
      for (let a = 0; a < this.headingElements.length; a++) {
        let s = e.getHeadingLevel(this.headingElements[a]);
        t = s < t ? s : t;
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
        a = this.tocElement;
      for (let s = 0; s < this.headingElements.length; s++) {
        let n = this.headingElements[s],
          o = e.getHeadingLevel(n),
          l = o - t,
          i = D.createElement("a");
        if ((n.id || (n.id = e.generateId(n)), (i.href = `#${n.id}`), (i.textContent = n.textContent), l > 0)) {
          for (let e = 0; e < l; e++) {
            let e = D.createElement("ol"),
              t = D.createElement("li");
            e.appendChild(t), a.appendChild(e), (a = t);
          }
          a.appendChild(i);
        } else {
          for (let e = 0; e < -l; e++) a = a.parentNode.parentNode;
          let e = D.createElement("li");
          e.appendChild(i), a.parentNode.appendChild(e), (a = e);
        }
        t = o;
      }
      this.toElement.appendChild(this.tocElement.firstChild);
    }
  }
  new e({ from: $(".docs"), to: tableOfContents }).generateToc();
}

//for post.js
if (forYouElement) {
  Observe(() => {
    let label = $(".info .x .n a")?.dataset?.label;
    if (label) {
      fetch(`/feeds/posts/default/-/${label}?alt=json`)
        .then((res) => res.json())
        .then((data) => {
          let entries = (data.feed.entry || []).map((entry) => ({
            title: entry.title.$t,
            link: entry.link.find((l) => l.rel === "alternate").href,
            img: entry.media$thumbnail ? entry.media$thumbnail.url.replace(/\/s\d+-c/, "/s300-c") : settings.img1,
          }));
          for (let i = entries.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
          }
          let topPosts = entries.slice(0, 4);
          let html = "";
          topPosts.forEach((post) => {
            html += `<article class='flex align-center'><a class='nolight' href='${post.link}' rel="bookmark"><img decoding="async" fetchpriority="high" loading='lazy' src='${post.img}' alt="${post.title}"/></a><h2 class='pFont fontsize16'><a href='${post.link}' rel="bookmark">${post.title}</a></h2></article>`;
          });
          forYouElement.innerHTML = html;
        })
        .catch((err) => {
          forYouElement.innerHTML = "<div class='error'>Could not load related posts.</div>";
        });
    }
  }, [forYouElement, 0, { rootMargin: "200px" }]);
}

//bookPost
if (bookPost) {
  const emptyMsgHTML = `<p class="PI sColor">It looks like you haven't added anything yet. Don't leave this blank, <span class="fontw500 pColor">add your favorite articles now.</span></p><a class="button big r gap16 fontw500 fontsize13 nolight beforetext" href="/" data-text="Let's add one!"><svg><use href="#iGo"></use></svg></a>`;
  function renderPosts(e) {
    let t = $("#postContainer");
    (t.innerHTML = ""),
      e.forEach((e) => {
        let a = e.entry,
          s = a.title.$t,
          n = a.link.find((e) => "alternate" === e.rel).href,
          o = a.media$thumbnail ? a.media$thumbnail.url.replace(/\/s\d+-c/, "/s300-c") : settings.img1,
          i = a.id.$t.split(".post-").pop(),
          r = D.createElement("article");
        (r.className = "bookmark-post inheritcolor"),
          (r.innerHTML = `<div class='img'><a class='nolight' href="${n}" rel="bookmark"><img decoding="async" fetchpriority="high" loading='lazy' src="${o}" alt="${s}"></a></div><div class="titleI"><h2><a href="${n}" rel="bookmark">${s}</a></h2></div><div class="deleteBtn flex place-center" data-postId="${i}"><svg><use href="#iDel"></use></svg></div>`),
          t.appendChild(r),
          r.querySelector(".deleteBtn").addEventListener("click", () => {
            deletePost(i);
          });
      });
  }
  function deletePost(e) {
    let t = JSON.parse(S.getItem("bookmarkedPosts")) || [];
    (t = t.filter((t) => t !== e)),
      S.setItem("bookmarkedPosts", JSON.stringify(t)),
      $(`.deleteBtn[data-postId='${e}']`)?.closest(".bookmark-post")?.remove(),
      updateBookmarkCount(),
      0 === t.length && ($("#postContainer").innerHTML = emptyMsgHTML);
  }
  (() => {
    let e = $("#postContainer");
    if (!e) return;
    let t = JSON.parse(S.getItem("bookmarkedPosts")) || [];
    0 !== t.length
      ? Promise.all(t.map((e) => fetch(`/feeds/posts/default/${e}?alt=json`).then((e) => e.json())))
          .then((t) => {
            let a = t.filter(Boolean);
            0 === a.length ? (e.innerHTML = emptyMsgHTML) : renderPosts(a);
          })
          .catch(() => {
            e.innerHTML = emptyMsgHTML;
          })
      : (e.innerHTML = emptyMsgHTML);
  })();
}

//filterPost
if (filterPost) {
  const b = $(".stories.grid"),
    v = $$(".manage .button"),
    k = $(".manage .all.button"),
    C = $(".filterName"),
    L = b.innerHTML,
    y = $(".pagination"),
    E = $(".pagination .button:first-child");
  let x = null,
    w = "",
    M = [],
    P = 0;
  function showSkeletons() {
    clearPosts();
    for (let e = 0; e < 12; e++) {
      const e = D.createElement("div");
      (e.className = "skeleton flex column"), (e.innerHTML = `<div class="img"></div><div class="text i"></div><div class="text o"></div><div class="text u"></div>`), b.appendChild(e);
    }
  }
  function clearPosts() {
    (b.innerHTML = ""), rClass(b, "nothing", "error"), x && x.remove();
  }
  function showNoPosts() {
    clearPosts(), aClass(b, "nothing");
  }
  function showError() {
    clearPosts(), aClass(b, "error");
  }
  function renderPosts() {
    const e = M.slice(P, P + 12)
      .map(createPostHTML)
      .join("");
    (b.innerHTML += e),
      (P += 12),
      initializeSaveButtons(),
      loadSavedPosts(),
      "undefined" != typeof firebase && firebase.apps?.length && "function" == typeof loadClickCounts && loadClickCounts(),
      x && (x.remove(), (x = null)),
      P < M.length &&
        ((x = D.createElement("button")),
        (x.className = "button big r nolight beforetext"),
        setA(x, "data-text", getA(E, "data-text")),
        y.appendChild(x),
        (x.onclick = () => {
          const e = x;
          aClass(e, "loading"),
            setTimeout(() => {
              renderPosts(), rClass(e, "loading");
            }, 1500);
        }));
  }
  function createPostHTML(e) {
    const t = e.title?.$t || "Untitled",
      a = e.id?.$t?.split(".post-")[1],
      s = e.link?.find((e) => "alternate" === e.rel)?.href || "#",
      n = (e.category?.map((e) => e.term) || [])[0] || "",
      o = e.published?.$t || "",
      l = e.updated?.$t || o;
    let i = settings.img2;
    const d = e.media$thumbnail?.url || e.media$content?.[0]?.url;
    return (
      d && (i = d.replace(/\/s\d+-c/, "/w420-h236-p-k-no-nu")),
      `<article><div class="thumbnail relative nolight"><a href="${s}" rel="bookmark"><img alt="${t}" decoding="async" fetchpriority="high" loading='lazy' src="${i}"></a><div class="book flex place-center absolute pBg"><span class="save-this cursorpointer" data-postid="${a}"><svg><use href="#iBook"></use><use href="#iBook2"></use></svg></span></div></div><div class="i"><div class="nop sColor tFont fontsize13 flex align-center justify-between" style="margin-block:14px 10px"><time datetime="${l}">---</time><a aria-label="Like" class="likeI gap6 flex place-center aftertext" data-id="${a}" data-text="--" href="${s}"><svg><use href="#iLike"></use><use href="#iLike2"></use></svg></a></div><h2 class="title pFont"><a href="${s}" rel="bookmark">${t}</a></h2><footer class="tag beforetext fontsize12 sFont" data-text="in "><a aria-label="${n}" class="beforetext" data-text="${n}" href="/search/label/${n}" rel="tag"></a></footer></div></article>`
    );
  }
  function setFilterLabel(e) {
    setA(C, "data-text", e || getA(k, "data-text")), localStorage.setItem("selectedLabel", e), (w = e);
  }
  function selectButton(e) {
    v.forEach((t) => {
      t.classList.toggle("selected", getA(t, "data-value") === e);
    });
  }
  function loadLabelPosts(e) {
    showSkeletons(),
      fetch(`/feeds/posts/default/-/${e}?alt=json`)
        .then((e) => e.json())
        .then((e) => {
          if (((M = e.feed.entry || []), (P = 0), 0 === M.length)) return showNoPosts();
          clearPosts(), renderPosts();
        })
        .catch(() => {
          showError();
        });
  }
  v.forEach((e) => {
    e.addEventListener("click", () => {
      $("#filterI").checked = !1;
      const t = getA(e, "data-value");
      setFilterLabel(t),
        selectButton(t),
        x && (x.remove(), (x = null)),
        t
          ? (setA(E, "hidden", "true"), loadLabelPosts(t))
          : (clearPosts(),
            (b.innerHTML = L),
            E.removeAttribute("hidden"),
            y.removeAttribute("hidden"),
            initializeSaveButtons(),
            loadSavedPosts(),
            "undefined" != typeof firebase && firebase.apps && firebase.apps.length && "function" == typeof loadClickCounts && loadClickCounts());
    });
  }),
    (() => {
      const e = localStorage.getItem("selectedLabel") || "",
        t = $(`.manage .button[data-value="${e}"]`);
      t && t.click();
    })();
}
