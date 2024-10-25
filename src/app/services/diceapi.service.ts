import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class dicepiService {

  apiUrl = 'https://dice-roll3.p.rapidapi.com/api/roll/multiple'; 
  apiKey = 'ba60d72ddemsh4111432460f8422p10e931jsncaff103bddc8';
  apiHost = 'dice-roll3.p.rapidapi.com';
  

  constructor(private http: HttpClient) {

   }

   rollMultipleDice(diceConfig: { sides: number; rolls: number }[]): Observable<any> {
    const data = {
      dice: diceConfig
    };

    const headers = new HttpHeaders({
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
  
}
