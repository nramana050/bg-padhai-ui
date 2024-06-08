export class ConvertOmbedToIframe{

  static async convertToIframe(htmlContent) {

    if(htmlContent.includes('oembed')){

      let html = htmlContent;
      html = html as HTMLElement;
      let container = document.createElement("div");
      container.innerHTML = html.trim();
      let oembedElements = container.querySelectorAll('oembed');
      const fetchPromises = [];
      oembedElements.forEach(async (oembedElement: HTMLElement) => {

        const url = oembedElement.getAttribute('url');
        if (!url) return;

        if (url.includes('youtube.com')) {

          const youtubeRegex = [
            /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)(?:&t=(\d+))?/,
            /^https?:\/\/(?:www\.)?youtube\.com\/v\/([\w-]+)(?:\?t=(\d+))?/,
            /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([\w-]+)(?:\?start=(\d+))?/,
            /^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)(?:\?t=(\d+))?/,
            /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)&list=([\w-]+)/,
            /^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=([\w-]+)/
        ];
          let iframeContainer = document.createElement("div");
          Object.assign(iframeContainer.style, {
            position: 'relative',
            paddingBottom: '50%',
            height: '0'
          });
          let iframeContent = ''; 

          iframeContent = this.convertIntoIframe(url, 'youtube', youtubeRegex);

          iframeContainer.innerHTML = iframeContent.trim();
          var iframe = iframeContainer.querySelector("iframe");
          if (iframe) {

            iframe.setAttribute("width", "100%");
            oembedElement.parentNode.replaceChild(iframeContainer, oembedElement);
          }
        } else if (url.includes('dailymotion.com')) {

          const dailyMotionRegex = [
            /^https?:\/\/dailymotion\.com\/video\/(\w+)/,
            /^https?:\/\/www\.dailymotion\.com\/video\/(\w+)/
          ];   
          let iframeContainer = document.createElement("div");
          Object.assign(iframeContainer.style, {
            position: 'relative',
            paddingBottom: '50%',
            height: '0'
          });
          let iframeContent = ''; 

          iframeContent = this.convertIntoIframe(url,'dailyMotion',dailyMotionRegex);
          iframeContainer.innerHTML = iframeContent.trim();
          var iframe = iframeContainer.querySelector("iframe");
          if (iframe) {

            iframe.setAttribute("width", "100%");
            oembedElement.parentNode.replaceChild(iframeContainer, oembedElement);
          }
          
        } else if (url.includes('vimeo.com')) {

          const vimeoRegex = [
            /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/,
            /^https?:\/\/(?:www\.)?vimeo\.com\/[^/]+\/[^/]+\/video\/(\d+)/,
            /^https?:\/\/(?:www\.)?vimeo\.com\/album\/[^/]+\/video\/(\d+)/,
            /^https?:\/\/(?:www\.)?vimeo\.com\/channels\/[^/]+\/(\d+)/,
            /^https?:\/\/(?:www\.)?vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
            /^https?:\/\/(?:www\.)?vimeo\.com\/ondemand\/[^/]+\/(\d+)/,
            /^https?:\/\/(?:player\.)?vimeo\.com\/video\/(\d+)/,
          ];

          let iframeContainer = document.createElement("div");
          Object.assign(iframeContainer.style, {
            position: 'relative',
            paddingBottom: '50%',
            height: '0'
          });
          let iframeContent = ''; 

          iframeContent = this.convertIntoIframe(url,'vimeo',vimeoRegex);
          iframeContainer.innerHTML = iframeContent.trim();
          var iframe = iframeContainer.querySelector("iframe");
          if (iframe) {

            iframe.setAttribute("width", "100%");
            oembedElement.parentNode.replaceChild(iframeContainer, oembedElement);
          }
        }
      })
      
      await Promise.all(fetchPromises);
      return container.innerHTML;
    }else{

      return htmlContent;
    }
  }

  static convertIntoIframe(url, mediaType, regexRules){

    for (const regex of regexRules) {
      console.log(url,regex);
      
        const match = url.match(regex);
        console.log(match,"this is match");
        
        if (match) {

            switch (mediaType) {

              case 'youtube':

                if (regex.source === /^youtube\.com\/playlist\?list=([\w-]+)/.source && regex.test(url)) {

                  const playlistId = url.match(regex)[1];
                  return `<iframe src="https://www.youtube.com/embed/videoseries?list=${playlistId}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
              } else if (regex.test(url)) {

                  const match = url.match(regex);
                  const videoId = match[1];
                  const timestamp = match[2] ? `?start=${match[2]}` : "";
                  return `<iframe src="https://www.youtube.com/embed/${videoId}${timestamp}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
              }

              case 'vimeo':

                return `<iframe src="https://player.vimeo.com/video/${match[1]}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allowfullscreen></iframe>`;

              case 'dailyMotion':
              console.log("dailyMotion",match,"this is match");
              
                return `<iframe src="https://www.dailymotion.com/embed/video/${match[1]}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" width="480" height="270" allowfullscreen allow="autoplay"></iframe>`;

              default:
                break;
            }
           
        }
    }

    return "";

  }
}