import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Vote } from "./vote.model";
import { map } from 'rxjs/operators';

@Injectable()
export class VotingService {

  constructor(private http: HttpClient) { }

  postVote(emoji_id: number) {
    return this.http.post('https://vote.carlosrv999.com/vote', { "emoji_id": emoji_id })
  }

  getVotes() {
    return this.http.get<Vote[]>('https://vote.carlosrv999.com/vote')
      .pipe(
        map(responseData => {
          const postsArray: Vote[] = [];
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
