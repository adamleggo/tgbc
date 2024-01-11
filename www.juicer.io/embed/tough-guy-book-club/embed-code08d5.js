(function () {
    var juicerCssUrl = "https://www.juicer.io/embed.css";
    var juicerJsUrl = "https://www.juicer.io/embed.js";

  function setAttributesToJuicerElement(juicerFeed) {
    if (!juicerFeed.hasAttribute('data-feed-id')) {
      juicerFeed.setAttribute('data-feed-id', 'tough-guy-book-club');
    }
    if (!juicerFeed.hasAttribute('data-origin')) {
      juicerFeed.setAttribute('data-origin', 'embed-code');
    }
    if (!juicerFeed.hasAttribute('data-per')) {
      juicerFeed.setAttribute('data-per', '12');
    }
    if (!juicerFeed.hasAttribute('data-columns')) {
      juicerFeed.setAttribute('data-columns', '4');
    }

  }
  var feedElements = document.querySelectorAll('.juicer-feed[data-feed-id="tough-guy-book-club" i]')
  if (feedElements.length === 0) {
    var juicerScript = document.currentScript;
    var juicerFeed = document.createElement('div');
    juicerFeed.setAttribute('class', 'juicer-feed');
    setAttributesToJuicerElement(juicerFeed);
    juicerScript.parentNode.appendChild(juicerFeed);
  } else {
    feedElements.forEach(setAttributesToJuicerElement);
  }

  var head  = document.head;
  var link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = juicerCssUrl;
  link.media = 'all';
  head.appendChild(link);


  var script = document.createElement('script');
  script.src = juicerJsUrl;
  head.appendChild(script);
})();
