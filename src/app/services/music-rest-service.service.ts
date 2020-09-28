import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concat, merge, Observable, } from 'rxjs';
import { mergeMap, map, flatMap, toArray, distinct, distinctUntilChanged } from 'rxjs/operators';
import { Album, Artist, MusicData, Song } from '../models/music-models';
import { of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

@Injectable({
  providedIn: 'root'
})
export class MusicRestServiceService {

  private url: string = 'http://localhost:5000/';

  private albums: string = 'albums'

  private song: string = 'songs'

  private artists: string = 'artists'

  constructor(private http: HttpClient) { }

  musicData: any[] = [];

  artist_name: string;
  album_name: string;
  year_released: number;
  song_track: number;
  song_name: string;

  getMusicData(sort: string, order: string, page: number): Observable<any[]> {

    console.log("sort: " , sort);

    if (sort == "song_name") {
     return this.getDataForSong_IDCol(order, page);
    }

    else if(sort == "song_track") {
      return this.getDataForSong_trackCol(order, page);
    }

    else if(sort == "year_released"){
      return this.getData_YearReleasedCol(order, page);
    }

    else if(sort == "album_name") {
      return this.getDataForAlbumName(order, page);
    }

    else {
      return this.getDataforArtistNameCol(order, page);
    }

 
  }

  getDataforArtistNameCol(order, page) :Observable<any[]> {

    let artistUrl = "http://localhost:5000/artists?_sort=name&_order="+order+"&_page="+(page+1)+"&_limit=10";
    let songUrl = "http://localhost:5000/songs?_sort=id&album_id=";
    let albumUrl = "http://localhost:5000/albums?artist_id=";
    console.log("artist-url: ", artistUrl)
    let orderurl = '&_order='+order;
    let pageurl  = '&_page='+(page+1);
    let limiturl = '&_limit=10';

    return this.http.get<Artist[]>(artistUrl)
            .pipe(
               mergeMap(artistArray=> artistArray.map(artist=> ({
                     "artist_id":artist.id,
                     "artist_name": artist.name
               }))),
               mergeMap(artist=> this.http.get<Album[]>(albumUrl+artist.artist_id+orderurl+limiturl+pageurl).pipe(
                 mergeMap(albumArray=> albumArray.map(album=> ({
                     "album_name": album.name, 
                     "album.id": album.id,
                     "artist_name": artist.artist_name,
                     "year_released":album.year_released
                 })))
               )),
               mergeMap(album=> this.http.get<Song[]>(songUrl+album["album.id"]+orderurl+limiturl+pageurl).pipe(
                   mergeMap(songArray=> songArray.map(song=> ({
                      "song_name": song.name,
                      "song_track": song.track,
                      "album_name": album.album_name, 
                      "artist_name": album.artist_name,
                      "year_released":album.year_released
                   }))
               )),
            ), toArray())
          

  }

  getDataForAlbumName(order:string, page:number):Observable<any[]> {

    let albumUrl = "http://localhost:5000/albums?_sort=name&_order="+order+'&_page='+(page+1)+'&_limit=10';
    let songUrl = "http://localhost:5000/songs?_album_id=";
    let artistUrl = "http://localhost:5000/artists?id=";

    console.log("album url: ", albumUrl);
 
    let orderurl= '&_order='+order;
    let pageUrl= '&_page='+(page+1);
    let limitUrl='&_limit=10';

    return this.http.get<Album[]>(albumUrl)
                   .pipe(
                     mergeMap(albumArray=> albumArray.map(album=> ({
                      "album_id":album.id,
                      "artist_id":album.artist_id,
                      "year_released":album.year_released,
                      "album_name":album.name
                     }))),
                     mergeMap(album=> this.http.get<Song[]>(songUrl+album.album_id+orderurl+pageUrl+limitUrl).pipe(
                      mergeMap(songArray=> songArray.map(song=> ({
                            "song_name":song.name,
                            "song_track":song.track,
                            "album_name":album.album_name,
                            "artist_id": album.artist_id,
                            "year_released": album.year_released
                      })))
               )),
               mergeMap(song=> this.http.get<Artist[]>(artistUrl+song.artist_id+orderurl+pageUrl+limitUrl).pipe(
                      mergeMap(artistArray => artistArray.map(artist=> ({
                        "song_name":song.song_name,
                        "song_track":song.song_track,
                        "album_name":song.album_name,
                        "artist_name": artist.name,
                        "year_released": song.year_released 
                      })))
               )),
               toArray()
            )
  }

  getData_YearReleasedCol(order:string, page:number):Observable<any[]> {
       
    let albumUrl = "http://localhost:5000/albums?_sort=year_released&_order="+order+'&_page='+(page+1)+'&_limit=10';
    let songUrl = "http://localhost:5000/songs?_album_id=";
    let artistUrl = "http://localhost:5000/artists?id=";

    let orderurl= '&_order='+order;

    let pageUrl= '&_page='+(page+1);

    let limitUrl='&_limit=10';

    console.log("album url for yearReleased:", albumUrl )

    this.http.get<Album[]>(albumUrl).pipe(albumArray => from(albumArray).pipe(distinctUntilChanged())).subscribe(a=> console.log(a));

    // return this.http.get<Album[]>(albumUrl)
    // .pipe(
    //   mergeMap(albumArray => from(albumArray)
    //                          .pipe(distinctUntilChanged((p, c)=> p.artist_id==c.artist_id && p.id == c.id
    //                           && p.name == c.name && p.year_released ==c.year_released))),
    //   mergeMap(album => this.http.get<Artist[]>(artistUrl+album.artist_id+orderurl+pageUrl+limitUrl)
    //                         .pipe( 
    //                            mergeMap(artistArray=> artistArray.map(artist=> ({
    //                                 "artist_name":artist.name,
    //                                 "album" : album
    //                             }))),
    //                             distinctUntilChanged((p, c)=> p.artist_name == c.artist_name && p.album.name == c.album.name && p.album.year_released == c.album.year_released)
    //                         )
    //   ),

    //   mergeMap(artist=> this.http.get<Song[]>(songUrl+artist.album.id+orderurl+pageUrl+limitUrl)
    //                         .pipe(
    //                            mergeMap(songArray => songArray.map(song=> ({
    //                                "song_name" : song.name,
    //                                "song_track" : song.track,
    //                                "artist" : artist
    //                            }))),
    //                            distinctUntilChanged((p, c)=> p.song_name==c.song_name && c.song_track == p.song_track &&
    //                                 p.artist.artist_name == c.artist.artist_name && p.artist.album.name == c.artist.album.name && p.artist.album.year_released == c.artist.album.year_released)
    //                         )
                            
      
    //   ),

    //   map(mData => {
    //         let musicData = new MusicData();
    //         musicData.album_name = mData.artist.album.name;
    //         musicData.year_released = mData.artist.album.year_released;
    //         musicData.song_name = mData.song_name;
    //         musicData.song_track = mData.song_track;
    //         musicData.artist_name = mData.artist.artist_name;
    //   }),

    //   toArray(),

    //   tap(array=> console.log(array))

    // )


    return this.http.get<Album[]>(albumUrl)
              .pipe(
                 mergeMap(albumArray=> albumArray.map(album=> ({
                     "album_id":album.id,
                     "artist_id":album.artist_id,
                     "year_released":album.year_released,
                     "album_name":album.name
                 }))),
                 mergeMap(album=> this.http.get<Song[]>(songUrl+album.album_id+orderurl+pageUrl+limitUrl).pipe(
                        mergeMap(songArray=> songArray.map(song=> ({
                              "song_name":song.name,
                              "song_track":song.track,
                              "album_name":album.album_name,
                              "artist_id": album.artist_id,
                              "year_released": album.year_released
                        })))
                 )),
                 tap(song=> console.log("song Url : ", artistUrl+song.artist_id+orderurl+pageUrl+limitUrl)),
                 mergeMap(song=> this.http.get<Artist[]>(artistUrl+song.artist_id+orderurl+pageUrl+limitUrl).pipe(
                        mergeMap(artistArray => artistArray.map(artist=> ({
                          "song_name":song.song_name,
                          "song_track":song.song_track,
                          "album_name":song.album_name,
                          "artist_name": artist.name,
                          "year_released": song.year_released 
                        })))
                 )),
                 toArray(),
                 tap(array => console.log("getData_YearReleasedCol: No of of Music Items returned: " , array.length))
              )
  }

  getDataForSong_trackCol(order:string, page:number):Observable<any[]> {

    let songUrl = 'http://localhost:5000/songs?_sort=track&_order=' + order + '&_page=' + (page + 1);
    let albumUrl = 'http://localhost:5000/albums?id=';
    let artistUrl = 'http://localhost:5000/artists?id=';

    console.log("song-url: ", songUrl);

    let orderurl= '&order='+order;


    return this.http.get<Song[]>(songUrl).pipe(
      mergeMap(songArray => songArray.map(song => ({ "song_track": song.track, 
      "song_name": song.name,
      "album_id": song.album_id }))),
      mergeMap(song=> this.http.get<Album[]>(albumUrl+song.album_id+orderurl).pipe(
                                                                  mergeMap(albumArray=> albumArray.map(album=>({
                                                                          "song_track":song.song_track,
                                                                          "song_name" : song.song_name,
                                                                          "album_name": album.name,
                                                                          "year_released":album.year_released,
                                                                          "artist_id": album.artist_id
                                                                  })))
        )),
        mergeMap(album=> this.http.get<Artist[]>(artistUrl+album.artist_id+orderurl).pipe(
         mergeMap(artistArray=> artistArray.map(artist=>({
                 "song_track":album.song_track,
                 "song_name" : album.song_name,
                 "album_name": album.album_name,
                 "year_released":album.year_released,
                 "artist_name": artist.name
         })))
       )),
       toArray(),
       tap(array => console.log("getDataForSong_trackCol: No of of Music Items returned: " , array.length))

       );
  }

  getDataForSong_IDCol(order: string, page: number): Observable<any[]> {
   
    let songUrl = 'http://localhost:5000/songs?_sort=name&_order=' + order + '&_page=' + (page + 1);
    let albumUrl = 'http://localhost:5000/albums?id=';
    let artistUrl = 'http://localhost:5000/artists?id=';

    console.log("song-url: ", songUrl);

    return this.http.get<Song[]>(songUrl).pipe(
      mergeMap(songArray => songArray.map(song => ({ "song_track": song.track, 
      "song_name": song.name,
      "album_id": song.album_id }))),
      mergeMap(song=> this.http.get<Album[]>(albumUrl+song.album_id).pipe(
                                                                  mergeMap(albumArray=> albumArray.map(album=>({
                                                                          "song_track":song.song_track,
                                                                          "song_name" : song.song_name,
                                                                          "album_name": album.name,
                                                                          "year_released":album.year_released,
                                                                          "artist_id": album.artist_id
                                                                  })))
        )),
        mergeMap(album=> this.http.get<Artist[]>(artistUrl+album.artist_id).pipe(
         mergeMap(artistArray=> artistArray.map(artist=>({
                 "song_track":album.song_track,
                 "song_name" : album.song_name,
                 "album_name": album.album_name,
                 "year_released":album.year_released,
                 "artist_name": artist.name
         })))
       )),
       toArray(),
       tap(array => console.log("No of items returned: " , array.length))
       );
  }

}
