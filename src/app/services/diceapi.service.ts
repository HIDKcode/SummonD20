import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class dicepiService {

  apiUrl = 'https://dice-roll3.p.rapidapi.com/api/roll/multiple'; 
  
  constructor(private http: HttpClient) {

   }

   rollMultipleDice(a: any,b: any): Observable<any> {
    const data = {
      dice: [
        { sides: a, rolls: b }
      ]
    };

    const headers = new HttpHeaders({
      'x-rapidapi-key': 'ba60d72ddemsh4111432460f8422p10e931jsncaff103bddc8',
      'x-rapidapi-host': 'dice-roll3.p.rapidapi.com',
      'Content-Type': 'application/json'
    });
    
    return this.http.post(this.apiUrl, data, { headers });
  }
  
}
