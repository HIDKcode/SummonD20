import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from './alert.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public database!: SQLiteObject

  t_USER: string = "CREATE TABLE IF NOT EXISTS USER();";
  //tablas del usuario
  t_ULT_CONEX: string = "CREATE TABLE IF NOT EXISTS t();";
  t_ESTADO: string = "CREATE TABLE IF NOT EXISTS t();";
  t_BENEFICIO: string = "CREATE TABLE IF NOT EXISTS t();";
  //tablas biblioteca usuario
  t_BIBLIOTECA: string = "CREATE TABLE IF NOT EXISTS t();";
  t_carpeta: string = "CREATE TABLE IF NOT EXISTS t();";
  t_archivo: string = "CREATE TABLE IF NOT EXISTS t();"; 
  //tablas sistema de salas
  t_GRUPO: string = "CREATE TABLE IF NOT EXISTS t();";
  t_PARTICIPANTE: string = "CREATE TABLE IF NOT EXISTS t();";
  t_MENSAJE: string = "CREATE TABLE IF NOT EXISTS t();";
  t_ADJUNTO: string = "CREATE TABLE IF NOT EXISTS t();";

  //insert por defecto en la Base de Datos
  r_user: string = " ";

  //ESTADO Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alerta: AlertService) {
    this.crearDB();
   }
   //funciones de retorno de observables
  fetchNoticias(): Observable<Noticias[]>{
    return this.listadoNoticias.asObservable();
  }
  
   dbState(){
    return this.isDBReady.asObservable();
  }

   crearDB(){

   }


}
