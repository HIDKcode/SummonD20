import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from './alert.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './clasesdb.ts';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public database!: SQLiteObject

  userID!: number;
  clave!: string;
  email!: string;
  perfil_media!: Blob;
  t_USER: string = "CREATE TABLE IF NOT EXISTS USER(userID INTEGER PRIMARY KEY autoincrement, clave TEXT NOT NULL, email TEXT NOT NULL, perfil_media BLOB);";
  //tablas del usuario
  t_ULT_CONEX: string = "CREATE TABLE IF NOT EXISTS ULT_CONEX(conexID INTEGER PRIMARY KEY AUTOINCREMENT, conexDATE TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_ESTADO: string = "CREATE TABLE IF NOT EXISTS ESTADO(activo BOOLEAN NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BENEFICIO: string = "CREATE TABLE IF NOT EXISTS BENEFICIO(beneficioID INTEGER PRIMARY KEY AUTOINCREMENT, page_date TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  //tablas biblioteca usuario
  t_BIBLIOTECA: string = "CREATE TABLE IF NOT EXISTS BIBLIOTECA(bibliotecaID INTEGER PRIMARY KEY AUTOINCREMENT, espacio_disponible INTEGER NOT NULL, USER_userID INTEGER,FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_CARPETA: string = "CREATE TABLE IF NOT EXISTS CARPETA(carpetaID INTEGER PRIMARY KEY AUTOINCREMENT,parent_carpetaID INTEGER,nombre TEXT NOT NULL,creacion_date TEXT NOT NULL, BIBLIOTECA_bibliotecaID INTEGER,parent_BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID),FOREIGN KEY (parent_BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID));";
  t_ARCHIVO: string = "CREATE TABLE IF NOT EXISTS t();"; 
  //tablas sistema de salas
  t_GRUPO: string = "CREATE TABLE IF NOT EXISTS t();";
  t_PARTICIPANTE: string = "CREATE TABLE IF NOT EXISTS t();";
  t_MENSAJE: string = "CREATE TABLE IF NOT EXISTS t();";
  t_ADJUNTO: string = "CREATE TABLE IF NOT EXISTS t();";

  //insert por defecto en la Base de Datos
  r_user: string = " ";

  //variables para guardar los registros resultantes de un select. l = Listado
  lUser = new BehaviorSubject([]);

  //ESTADO Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alerta: AlertService) {
    this.crearDB();
   }

   //funciones de retorno de observables
  fetchNoticias(): Observable<User[]>{
    return this.lUser.asObservable();
  }
  
   dbState(){
    return this.isDBReady.asObservable();
  }

   crearDB(){

   }


}
