import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from './alert.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './clasesdb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public database!: SQLiteObject


  userID!: number;
  clave!: string;
  correo!: string;
  perfil_media!: Blob;
  t_USER: string = "CREATE TABLE IF NOT EXISTS USER(userID INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT NOT NULL UNIQUE, clave TEXT NOT NULL, correo TEXT NOT NULL UNIQUE, perfil_media BLOB);";
  //tablas del usuario
  t_ULT_CONEX: string = "CREATE TABLE IF NOT EXISTS ULT_CONEX(conexID INTEGER PRIMARY KEY AUTOINCREMENT, conexDATE TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_ESTADO: string = "CREATE TABLE IF NOT EXISTS ESTADO(activo INTEGER NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BENEFICIO: string = "CREATE TABLE IF NOT EXISTS BENEFICIO(beneficioID INTEGER PRIMARY KEY AUTOINCREMENT, page_date TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  //tablas biblioteca usuario
  t_BIBLIOTECA: string = "CREATE TABLE IF NOT EXISTS BIBLIOTECA(bibliotecaID INTEGER PRIMARY KEY AUTOINCREMENT, espacio_disponible INTEGER NOT NULL, USER_userID INTEGER,FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_CARPETA: string = "CREATE TABLE IF NOT EXISTS CARPETA(carpetaID INTEGER PRIMARY KEY AUTOINCREMENT,parent_carpetaID INTEGER,nombre TEXT NOT NULL,creacion_date TEXT NOT NULL, BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID),FOREIGN KEY (parent_carpetaID) REFERENCES CARPETA(carpetaID));";
  t_ARCHIVO: string = "CREATE TABLE IF NOT EXISTS ARCHIVO(archivoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL,tamaño INTEGER NOT NULL,filepath_arc TEXT NOT NULL,tipo_archivo TEXT NOT NULL,subida_date TEXT NOT NULL,CARPETA_carpetaID INTEGER,CARPETA_BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (CARPETA_carpetaID) REFERENCES CARPETA(carpetaID),FOREIGN KEY (CARPETA_BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID));"; 
  //tablas sistema de salas
  t_GRUPO: string = "CREATE TABLE IF NOT EXISTS GRUPO(grupoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre_sala TEXT NOT NULL,clave INTEGER NOT NULL,descripcion TEXT,fechacreado TEXT NOT NULL,owner INTEGER NOT NULL);";
  t_PARTICIPANTE: string = "CREATE TABLE IF NOT EXISTS PARTICIPANTE(PARTICIPA INTEGER PRIMARY KEY AUTOINCREMENT,USER_userID INTEGER,GRUPO_grupoID INTEGER,FOREIGN KEY (USER_userID) REFERENCES USER(userID),FOREIGN KEY (GRUPO_grupoID) REFERENCES GRUPO(grupoID));";
  t_MENSAJE: string = "CREATE TABLE IF NOT EXISTS MENSAJE(msjID INTEGER PRIMARY KEY AUTOINCREMENT,msj_autor TEXT NOT NULL,msj_texto TEXT NOT NULL,msj_media TEXT,msj_date TEXT NOT NULL,PARTICIPANTE_participanteID INTEGER,FOREIGN KEY (PARTICIPANTE_participanteID) REFERENCES PARTICIPANTE(participanteID));";
  t_ADJUNTO: string = "CREATE TABLE IF NOT EXISTS ADJUNTO(mediaID INTEGER PRIMARY KEY AUTOINCREMENT,enviado_date TEXT NOT NULL, filepath_msj TEXT NOT NULL,media_tipo TEXT,MENSAJE_msjID INTEGER,FOREIGN KEY (MENSAJE_msjID) REFERENCES MENSAJE(msjID));";

  //insert por defecto en la Base de Datos
  ins_USER: string = "INSERT or IGNORE INTO USER(nick,clave,correo,perfil_media) VALUES('demon666', 'Lvame80d', 'demon666@example.com', NULL);";
  ins_USER2: string = "INSERT or IGNORE INTO USER(nick,clave,correo,perfil_media) VALUES('azath123', 'Azath321', 'azath123@example.com', NULL);";
  
  //variables para guardar los registros resultantes de un select. l = Listado
  lUser = new BehaviorSubject<User[]>([]);

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
    //verificar la plataforma
    this.platform.ready().then(()=>{
      //procedemos a crear la Base de Datos
      this.sqlite.create({
        name: 'summon.db',
        location:'default'
      }).then((db: SQLiteObject)=>{
        //capturar y guardar la conexión a la Base de Datos
        this.database = db;
        //llamar a la función de creación de tablas
        this.crearTablas();
        this.ListaUsers();
        //modificar el observable del status de la base de datos
        this.isDBReady.next(true);
      }).catch(e=>{
        this.alerta.presentAlert("Creación de BD", "Error creando la BD: " + JSON.stringify(e));
      })
    })
   }

   async crearTablas(){
    try{
      //mandar a ejecutar las tablas en el orden especifico
      await this.database.executeSql(this.t_USER,[]);
      await this.database.executeSql(this.t_ULT_CONEX,[]);
      await this.database.executeSql(this.t_ESTADO,[]);
      await this.database.executeSql(this.t_BENEFICIO,[]);
      await this.database.executeSql(this.t_BIBLIOTECA,[]);
      await this.database.executeSql(this.t_CARPETA,[]);
      await this.database.executeSql(this.t_ARCHIVO,[]);
      await this.database.executeSql(this.t_GRUPO,[]);
      await this.database.executeSql(this.t_PARTICIPANTE,[]);
      await this.database.executeSql(this.t_MENSAJE,[]);
      await this.database.executeSql(this.t_ADJUNTO,[]);
      //generamos los insert en caso que existan
      await this.database.executeSql(this.ins_USER,[]);

    }catch(e){
      this.alerta.presentAlert("Creación de Tabla", "Error creando las Tablas: " + JSON.stringify(e));
    }
  }

  ListaUsers(){
    return this.database.executeSql('SELECT * FROM USER',[]).then(res=>{
      //variable para almacenar el resultado de la consulta
      let items: User[] = [];
      //verificar si tenemos registros en la consulta
      if(res.rows.length > 0){
        //recorro el resultado
        for(var i = 0; i < res.rows.length; i++){
          //agregar el registro a mi variable
          items.push({
            userID: res.rows.item(i).userID,
            nick: res.rows.item(i).nick,
            clave: res.rows.item(i).clave,
            correo: res.rows.item(i).correo,
            perfil_media: res.rows.item(i).perfil_media
          })
        }
      }
      this.lUser.next(items as any);
    })
  }

    insertSala(gnombre: string, gclave: number, gdescripcion: string, gowner: number){
      
      return this.database.executeSql('INSERT INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES (?,?,?,date(now))',[gnombre,gclave,gdescripcion,gowner]).then(res=>{
        this.alerta.presentAlert("Creación de sala", "Proceso exitoso");
      }).catch(e=>{
        this.alerta.presentAlert("Creación de sala", "Error: " + JSON.stringify(e));
      })
    }
    }