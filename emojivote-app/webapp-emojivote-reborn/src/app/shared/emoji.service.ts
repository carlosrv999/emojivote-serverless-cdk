import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Emoji } from "./emoji.model";
import { map } from 'rxjs/operators';

@Injectable()
export class EmojiService {

  constructor (private http: HttpClient) { }

  getEmojis() {
    return this.http.get<Emoji[]>('http://emoji-api-loadbalancer-1797433793.us-east-2.elb.amazonaws.com/emoji')
      .pipe(
        map(responseData => {
          const postsArray: Emoji[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push(responseData[key]);
            }
          }
          return postsArray;
        })
      )
  }

}
