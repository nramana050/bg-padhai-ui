import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[convertOmbedToIframe]'
})
export class ConvertOmbedIntoIframe implements AfterViewInit {
  constructor(private elementRef: ElementRef) { }
  ngAfterViewInit() {
  const oembedElements = this.elementRef.nativeElement.querySelectorAll('oembed');
      if (oembedElements.length === 0) return;
      oembedElements.forEach((oembedElement: HTMLElement) => {
        const url = oembedElement.getAttribute('url');
        if (!url) return;
        let fetchUrl : string;
        if (url.includes('youtube.com')) {
          fetchUrl = 'https://www.youtube.com/oembed?url=';
        } else if (url.includes('dailymotion.com')) {
          fetchUrl = 'https://www.dailymotion.com/services/oembed?url';
        } else if (url.includes('vimeo.com')) {
          fetchUrl = 'https://vimeo.com/api/oembed.json?url=';
        }else{
          console.log("Not Supported.")
        }

        fetch(fetchUrl + encodeURIComponent(url))
          .then(response => response.json())
          .then(data => {
            if (data.html) {
              var container = document.createElement("div");
              Object.assign(container.style, {
                position: 'relative',
                paddingBottom: '50%',
                height: '0'
              });
              container.innerHTML = data.html.trim();
              var iframe = container.querySelector("iframe");
              if (iframe) {
                iframe.setAttribute("width", "100%");
                iframe.setAttribute("style", "position: absolute; width: 100%; height: 100%; top: 0; left: 0;");
                console.log(iframe,"this is iframe");
                
                oembedElement.parentNode.replaceChild(container, oembedElement);
              } else {
                console.error("No iframe found in the oEmbed response.");
              }
            } else {
              console.error("No HTML content found in the oEmbed response.");
            }
          })
          .catch(error => console.error("Error fetching oEmbed:", error));
      });    
  }   
}
