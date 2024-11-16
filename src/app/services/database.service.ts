import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from './alert.service';
import { BehaviorSubject, from, firstValueFrom, Observable } from 'rxjs';
import { User } from './clasesdb';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public database!: SQLiteObject

  //varaibles any
  Vvalida: any;

  userID!: number;
  clave!: string;
  correo!: string;
  perfil_media!: Blob;

  // Estado 0 Bloqueado, 5 Usuario permitido, 9 Admin.
  t_USER: string = "CREATE TABLE IF NOT EXISTS USER(userID INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT NOT NULL UNIQUE, clave TEXT NOT NULL, correo TEXT NOT NULL UNIQUE, perfil_media BLOB, estado INTEGER NOT NULL);";
  t_ULT_CONEX: string = "CREATE TABLE IF NOT EXISTS ULT_CONEX(conexID INTEGER PRIMARY KEY AUTOINCREMENT, conexDATE TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BENEFICIO: string = "CREATE TABLE IF NOT EXISTS BENEFICIO(beneficioID INTEGER PRIMARY KEY AUTOINCREMENT, page_date TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BIBLIOTECA: string = "CREATE TABLE IF NOT EXISTS BIBLIOTECA(bibliotecaID INTEGER PRIMARY KEY AUTOINCREMENT, espacio_disponible INTEGER NOT NULL, USER_userID INTEGER,FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_CARPETA: string = "CREATE TABLE IF NOT EXISTS CARPETA(carpetaID INTEGER PRIMARY KEY AUTOINCREMENT,parent_carpetaID INTEGER,nombre TEXT NOT NULL,creacion_date TEXT NOT NULL, BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID),FOREIGN KEY (parent_carpetaID) REFERENCES CARPETA(carpetaID));";
  t_ARCHIVO: string = "CREATE TABLE IF NOT EXISTS ARCHIVO(archivoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL, extension TEXT NOT NULL, tamaño INTEGER NOT NULL,subida_date TEXT NOT NULL,CARPETA_carpetaID INTEGER,CARPETA_BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (CARPETA_carpetaID) REFERENCES CARPETA(carpetaID),FOREIGN KEY (CARPETA_BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID));"; 
  t_GRUPO: string = "CREATE TABLE IF NOT EXISTS GRUPO(grupoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre_sala TEXT NOT NULL UNIQUE,clave INTEGER NOT NULL,descripcion TEXT,fechacreado TEXT NOT NULL,owner INTEGER NOT NULL);";
  t_PARTICIPANTE: string = "CREATE TABLE IF NOT EXISTS PARTICIPANTE(PARTICIPA INTEGER PRIMARY KEY AUTOINCREMENT,USER_userID INTEGER, GRUPO_grupoID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID),FOREIGN KEY (GRUPO_grupoID) REFERENCES GRUPO(grupoID), UNIQUE (USER_userID, GRUPO_grupoID));";
  t_MENSAJE: string = "CREATE TABLE IF NOT EXISTS MENSAJE(msjID INTEGER PRIMARY KEY AUTOINCREMENT,msj_autor TEXT NOT NULL,msj_texto TEXT NOT NULL,msj_media TEXT,msj_date TEXT NOT NULL,PARTICIPANTE_participanteID INTEGER,FOREIGN KEY (PARTICIPANTE_participanteID) REFERENCES PARTICIPANTE(participanteID));";
  t_ADJUNTO: string = "CREATE TABLE IF NOT EXISTS ADJUNTO(mediaID INTEGER PRIMARY KEY AUTOINCREMENT,enviado_date TEXT NOT NULL, filepath_msj TEXT NOT NULL,media_tipo TEXT,MENSAJE_msjID INTEGER,FOREIGN KEY (MENSAJE_msjID) REFERENCES MENSAJE(msjID));";
  t_ERRORES: string = "CREATE TABLE IF NOT EXISTS ERRORES(detalle TEXT NOT NULL, mensaje TEXT NOT NULL);";

  ins_USER: string = "INSERT OR IGNORE INTO USER(nick, clave, correo, perfil_media, estado) VALUES('martin123', '123456', 'martin123@correo.cl', NULL, 9);";
  ins_BIBLIOTECA: string = "INSERT OR IGNORE INTO BIBLIOTECA(espacio_disponible, USER_userID) VALUES(900, 1);";
  ins_CARPETA: string = "INSERT OR IGNORE INTO CARPETA(nombre, creacion_date, BIBLIOTECA_bibliotecaID) VALUES('summon_nube', date('now'), 1);";
  ins_ARCHIVO: string = "INSERT OR IGNORE INTO ARCHIVO(nombre, extension, tamaño, subida_date, CARPETA_carpetaID, CARPETA_BIBLIOTECA_bibliotecaID) VALUES('editor', 'png', 1024, date('now'), 1, 1);";
  ins_GRUPO: string = "INSERT OR IGNORE INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES('GrupoAdmin', 123456, 'Grupo de administración', date('now'), 1);";
  ins_GRUPO2: string = "INSERT OR IGNORE INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES('GrupoAdmin2', 333666, 'Grupo de administración2', date('now'), 1);";
  ins_PARTICIPANTE: string = "INSERT OR IGNORE INTO PARTICIPANTE(USER_userID, GRUPO_grupoID) VALUES(1, 1);"; 
  ins_PARTICIPANTE2: string = "INSERT OR IGNORE INTO PARTICIPANTE(USER_userID, GRUPO_grupoID) VALUES(1, 2);"; 

  //ESTADO Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform,private alerta: AlertService, private nativeStorage: NativeStorage,private http: HttpClient, private router: Router){
        this.platform.ready().then(()=>{
        this.crearDB();
      })
   }
  
  // devuelve estado de db
  dbState(){
    return this.isDBReady.asObservable();
  }

   crearDB(){
      //procedemos a crear la Base de Datos
      this.sqlite.create({
        name: 'summonV10',
        location:'default'
      }).then((db: SQLiteObject)=>{
        //capturar y guardar la conexión a la Base de Datos
        this.database = db;
        //llamar a la función de creación de tablas
        this.crearTablas();
        //modificar el observable del status de la base de datos
        this.isDBReady.next(true);
      }).catch(e=>{
        this.alerta.presentAlert("Creación de BD", "Error creando la BD: " + JSON.stringify(e));
      })
    
   }


async crearTablas(){
    try{
      //mandar a ejecutar las tablas en el orden especifico
      await this.database.executeSql(this.t_USER,[]);
      await this.database.executeSql(this.t_ULT_CONEX,[]);
      await this.database.executeSql(this.t_BENEFICIO,[]);
      await this.database.executeSql(this.t_BIBLIOTECA,[]);
      await this.database.executeSql(this.t_CARPETA,[]);
      await this.database.executeSql(this.t_ARCHIVO,[]);
      await this.database.executeSql(this.t_GRUPO,[]);
      await this.database.executeSql(this.t_PARTICIPANTE,[]);
      await this.database.executeSql(this.t_MENSAJE,[]);
      await this.database.executeSql(this.t_ADJUNTO,[]);
      await this.database.executeSql(this.t_ERRORES,[]);
      //generamos los insert en caso que existan
      await this.database.executeSql(this.ins_USER, []);
      await this.database.executeSql(this.ins_BIBLIOTECA, []);
      await this.database.executeSql(this.ins_CARPETA, []);
      await this.database.executeSql(this.ins_ARCHIVO, []);
      await this.database.executeSql(this.ins_GRUPO, []);
      await this.database.executeSql(this.ins_PARTICIPANTE, []);
      await this.database.executeSql(this.ins_GRUPO2, []);
      await this.database.executeSql(this.ins_PARTICIPANTE2, []);
    }catch(e){
      this.alerta.presentAlert("Creación de Tabla", "Error creando las Tablas: " + JSON.stringify(e));
    }
  }


  ListaUsers(): Observable<User[]> {
    const CONSULTA = `SELECT userID, nick, correo, perfil_media, estado
    FROM USER;`;
    
    return new Observable(observer => {
      this.database.executeSql(CONSULTA, [])
        .then(res => {
          const USUARIO = [];
          for (let i = 0; i < res.rows.length; i++) {
            USUARIO.push(res.rows.item(i));
          }
          observer.next(USUARIO);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  ListaGrupos(): Observable<any[]> {
    const CONSULTA = `
    SELECT G.grupoID, G.nombre_sala, U.nick AS oNick, COUNT(P.PARTICIPA) AS totalParticipantes
    FROM GRUPO G
    JOIN USER U ON G.owner = U.userID
    LEFT JOIN PARTICIPANTE P ON G.grupoID = P.GRUPO_grupoID
    GROUP BY G.grupoID, G.nombre_sala, U.nick;
    `;
    
    return new Observable(observer => {
      this.database.executeSql(CONSULTA, [])
        .then(res => {
          const GRUPO = [];
          for (let i = 0; i < res.rows.length; i++) {
            GRUPO.push(res.rows.item(i));
          }
          observer.next(GRUPO);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  async setNick(nick: string){
    await this.nativeStorage.setItem('userData', { nick });
  }

  fetchUser(nick: string): Observable<User[]> {
    this.setNick(nick);
    const CONSULTA = `SELECT userID, nick, correo, perfil_media, estado
        FROM USER
        WHERE nick = ?`
    return new Observable(observer => {
      this.database.executeSql(CONSULTA, [nick]).then(res => {
          let fetchedUser: User[] = [];
          if (res.rows.length > 0) {
            fetchedUser.push({
              userID: res.rows.item(0).userID,
              nick: res.rows.item(0).nick,
              correo: res.rows.item(0).correo,
              perfil_media: res.rows.item(0).perfil_media,
              estado: res.rows.item(0).estado
            });
          } else { 
            this.alerta.presentAlert("Usuario no encontrado", "Fallo");
            this.router.navigate(['/login']);
          }
          observer.next(fetchedUser);
          observer.complete();
        })
        .catch(e => {
          const em = e.message
          this.alerta.presentAlert("Fallo en proceso fetch", "E: "+em);
          observer.error(e);
        });
    });
  }


  //Validadores boolean
  async validaClave(nick: string, clave: string): Promise<boolean> {
    const CONSULTA = await this.database.executeSql('SELECT COUNT(*) as count FROM USER WHERE nick = ? AND clave = ?', [nick, clave]);

    if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).count > 0) {
      return true;
    } else {
      return false;
    }
  }

  async validaClaveGrupo(id: number, pass: number): Promise<boolean>{
    const CONSULTA = await this.database.executeSql('SELECT COUNT(*) as count FROM GRUPO WHERE grupoID = ? AND clave = ?;',[id, pass]);

      if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).count > 0) {
        return true;
      } else {
        return false;
      }
  }

  async Unico(Vnick: string, Vcorreo: string): Promise<boolean> {
    const CONSULTA = await this.database.executeSql('SELECT * FROM USER WHERE nick = ? OR correo = ?;', [Vnick, Vcorreo]);
    // Si row.lenght === 0 es porque el usuario no existe, UNICO true, ver qué debe entregar y como recepcionar el TRUE
    if (CONSULTA.rows.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  // FIN VALIDADORES BOOLEAN

  async getArchivoIdMas1(): Promise<number | null>{
    try{
      const CONSULTA = await this.database.executeSql('SELECT MAX(mediaID) as maxID from ARCHIVO;');
      if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).maxID !== null){
        return CONSULTA.rows.item(0).maxID + 1;
      } else {
        return 1;
      } 
    } catch (e: any) {
      await this.logError("getArchivo", e.code ||': '|| e.message);
      this.alerta.presentAlert("Fallo en getArchivo", "Contacte soporte por errorr:" + e.message);
      return null;
    }
  }

  // Funciones de registro
  async registerUser(nick: string, Vcorreo: string, Vpassword: string): Promise<boolean> {
    try {
      // Las alertas funcionarán como console.log en android studio para testing. 5 es = a Usuario permitido
        await this.database.executeSql('INSERT INTO USER(nick, clave, correo, estado) VALUES (?, ?, ?, ?);', [nick, Vpassword, Vcorreo, 5]);
        //this.alerta.presentAlert("1", "a");
        const userCheck = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?;', [nick]);
        //this.alerta.presentAlert("1", "b");
        const userid = userCheck.rows.item(0).userID; // Accede al userID correctamente
        //this.alerta.presentAlert("1", "c");
        await this.database.executeSql('INSERT INTO BIBLIOTECA(espacio_disponible, USER_userID) VALUES (900, ?);', [userid]);
        //this.alerta.presentAlert("1", "d");
        await this.database.executeSql('INSERT INTO CARPETA(nombre, creacion_date, BIBLIOTECA_bibliotecaID) VALUES (?, date("now"), ?)', ['summon_nube', userid]);
        //this.alerta.presentAlert("1", "f");
        this.alerta.presentAlert("Funcion registro", "Registro exitoso.");
        return true; // Registro exitoso
    } catch (e: any) {
      await this.logError("registerUser", e.code ||': '|| e.message);
      this.alerta.presentAlert("Fallo en registro", "Contacte soporte por error:" + e.message);
      return false; // Fallo en el registro
    }
  }


  // Registrar Errores
  logError(title: any, msj: any){
    // Se debe ingresar en title el nombre de la función y en mensaje eCode||': '||eMessage
    this.database.executeSql('INSERT INTO ERRORES VALUES(?,?);', [title, msj])
  }

  // INSERTS

  async updateUserProfile(userID: string, base64Image: string){
    try {
      const MODIFICA = await this.database.executeSql('UPDATE USER SET perfil_media = ? WHERE idnoticia = ?',[base64Image, userID]);
      if (MODIFICA.rowsAffected > 0){
        this.alerta.presentAlert("Modificar", "Imagen Modificada");
      } else {
        this.alerta.presentAlert("Modificar", "No se encontró el usuario y/o la imagen no se pudo modificar.");
      }
    }catch(e: any){
      await this.logError("registerUser", e.code ||': '|| e.message);
      this.alerta.presentAlert("Fallo en registro", "Contacte soporte por error:" + e.message);
    }
  }

  // Genero con http de la imagen para convertirlo en Uint8array (comaptible de blob sqlite)
  async blobimg(): Promise<Uint8Array> {
    const response = await firstValueFrom(this.http.get('assets/images/def_profile.png', { responseType: 'blob' }));
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);  
  }
  
  // Verificar inserts
  insertSala(gnombre: string, gclave: number, gdescripcion: string, userid: number){
      return this.database.executeSql('INSERT INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES (?,?,?,date("now"))',[gnombre,gclave,gdescripcion,userid]).then(res=>{
        this.alerta.presentAlert("Creación de sala", "Proceso exitoso");
      }).catch(e=>{
        this.alerta.presentAlert("Creación de sala", "Error: " + JSON.stringify(e));
      })
    }
  
  async  insertParticipante(nick: string, grupoID: number){
    try {
      const userID = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?;', [nick]);
      await this.database.executeSql('INSERT OR IGNORE INTO PARTICIPANTE (USER_userID, GRUPO_grupoID) VALUES (?, ?)',[userID, grupoID]
      );
      this.alerta.presentAlert("Ingreso a sala ID#" + grupoID, "Con exito");
    } catch (e) {
      this.alerta.presentAlert("Ingreso a sala ID#" + grupoID, "Error: " + JSON.stringify(e));
    }
  }

  async insertGrupo(nick: string, descr: string, clave: number){
  try {
  const userID = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?;', [nick]);
  const result = await this.database.executeSql('INSERT OR IGNORE INTO GRUPO (nombre_sala, clave, descripcion, fechacreado, owner) VALUES (?, ?, ?, date("now"), ?)',[nick, clave, descr, userID]
  );
  this.router.navigate(['/sala', result.insertId]);
    } catch (e) {
  console.error('Error al crear el grupo:', e);
  throw e; // Enviamos el error a funcion valida
}
  }

  //getters
  

}