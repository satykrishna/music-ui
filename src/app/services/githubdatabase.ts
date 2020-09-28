import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { GithubApi } from '../models/music-models';


/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
    constructor(private _httpClient: HttpClient) {}
  
    getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
      const href = 'https://api.github.com/search/issues';
      const requestUrl =
          `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;
        console.log(requestUrl);
      return this._httpClient.get<GithubApi>(requestUrl);
    }
  }