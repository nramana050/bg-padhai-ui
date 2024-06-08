import { Component, OnInit, ElementRef, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';
import { VgApiService } from '@videogular/ngx-videogular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() idx: string;
  @Input() src: string;
  @Input() type: string;
  @Input() option: {};
  @Input() poster: any;
  private api: VgApiService;
  defaultImageFlag: boolean = false;

  constructor(private readonly sanitizer: DomSanitizer) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  async onPlayerReady(api: VgApiService) {
    this.api = api;
    const posertURL = await this.getPoster(this.type, this.src);
    if (posertURL) {
      this.poster = posertURL;
    }
  }
  async getPoster(type, src) {
    let posterURL: any = null;
    if (type === "audio/mp3" || type === "audio/mpeg") {
      this.defaultImageFlag = true;
      // get mp3 cover art

      try {
        const tag: any = await this.setPoster(src);
        if (tag.tags.picture) {
          const data = new Uint8Array(tag.tags.picture.data);
          const blob = new Blob([data], { type: tag.tags.picture.format });
          const url = URL.createObjectURL(blob);
          if (url) {
            posterURL = this.sanitizer.bypassSecurityTrustUrl(url);
          }


        }
      } catch (error) {
        console.error("ERROR in getPoster -->>" + error);
      }
    }
    return posterURL;
  }

  async setPoster(path: string) {
    const poster: string = null;
    return new Promise((resolve, reject) => {
      new jsmediatags.Reader(path)
        .read({
          onSuccess: (tag) => {
            resolve(tag);
          },
          onError: (error) => {
            reject(error);
          }
        });
    });
  }

}

