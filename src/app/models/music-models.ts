export class Album {
    "id": number
    "name": string
    "artist_id": number
    "year_released": number
}

export class Song {
    "album_id": number
    "track": number
    "id": number
    "name": string
}

export class Artist {
    "id": number
    "name": string
}

export class MusicData {
    artist_name:string;
    album_name:string;
    year_released: number;
    song_track:number;
    song_name:string;
 }

 
 export interface GithubApi {
    items: GithubIssue[];
    total_count: number;
  }
  
  export interface GithubIssue {
    created_at: string;
    number: string;
    state: string;
    title: string;
  }
  