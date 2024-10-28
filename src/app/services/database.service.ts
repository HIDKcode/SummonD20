import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from './alert.service';
import { BehaviorSubject, from, firstValueFrom, Observable } from 'rxjs';
import { GRUPO, User } from './clasesdb';
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


  t_USER: string = "CREATE TABLE IF NOT EXISTS USER(userID INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT NOT NULL UNIQUE, clave TEXT NOT NULL, correo TEXT NOT NULL UNIQUE, perfil_media BLOB);";
  t_ULT_CONEX: string = "CREATE TABLE IF NOT EXISTS ULT_CONEX(conexID INTEGER PRIMARY KEY AUTOINCREMENT, conexDATE TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  // Estado: 1 = Activo 3 = Bloqueado , 0 = Inactivo , 7 = Admin?
  t_ESTADO: string = "CREATE TABLE IF NOT EXISTS ESTADO(activo INTEGER NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BENEFICIO: string = "CREATE TABLE IF NOT EXISTS BENEFICIO(beneficioID INTEGER PRIMARY KEY AUTOINCREMENT, page_date TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BIBLIOTECA: string = "CREATE TABLE IF NOT EXISTS BIBLIOTECA(bibliotecaID INTEGER PRIMARY KEY AUTOINCREMENT, espacio_disponible INTEGER NOT NULL, USER_userID INTEGER,FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_CARPETA: string = "CREATE TABLE IF NOT EXISTS CARPETA(carpetaID INTEGER PRIMARY KEY AUTOINCREMENT,parent_carpetaID INTEGER,nombre TEXT NOT NULL,creacion_date TEXT NOT NULL, BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID),FOREIGN KEY (parent_carpetaID) REFERENCES CARPETA(carpetaID));";
  t_ARCHIVO: string = "CREATE TABLE IF NOT EXISTS ARCHIVO(archivoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL,tamaño INTEGER NOT NULL,filepath_arc TEXT NOT NULL,tipo_archivo TEXT NOT NULL,subida_date TEXT NOT NULL,CARPETA_carpetaID INTEGER,CARPETA_BIBLIOTECA_bibliotecaID INTEGER,FOREIGN KEY (CARPETA_carpetaID) REFERENCES CARPETA(carpetaID),FOREIGN KEY (CARPETA_BIBLIOTECA_bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID));"; 
  t_GRUPO: string = "CREATE TABLE IF NOT EXISTS GRUPO(grupoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre_sala TEXT NOT NULL UNIQUE,clave INTEGER NOT NULL,descripcion TEXT,fechacreado TEXT NOT NULL,owner INTEGER NOT NULL);";
  t_PARTICIPANTE: string = "CREATE TABLE IF NOT EXISTS PARTICIPANTE(PARTICIPA INTEGER PRIMARY KEY AUTOINCREMENT,USER_userID INTEGER,GRUPO_grupoID INTEGER,FOREIGN KEY (USER_userID) REFERENCES USER(userID),FOREIGN KEY (GRUPO_grupoID) REFERENCES GRUPO(grupoID));";
  t_MENSAJE: string = "CREATE TABLE IF NOT EXISTS MENSAJE(msjID INTEGER PRIMARY KEY AUTOINCREMENT,msj_autor TEXT NOT NULL,msj_texto TEXT NOT NULL,msj_media TEXT,msj_date TEXT NOT NULL,PARTICIPANTE_participanteID INTEGER,FOREIGN KEY (PARTICIPANTE_participanteID) REFERENCES PARTICIPANTE(participanteID));";
  t_ADJUNTO: string = "CREATE TABLE IF NOT EXISTS ADJUNTO(mediaID INTEGER PRIMARY KEY AUTOINCREMENT,enviado_date TEXT NOT NULL, filepath_msj TEXT NOT NULL,media_tipo TEXT,MENSAJE_msjID INTEGER,FOREIGN KEY (MENSAJE_msjID) REFERENCES MENSAJE(msjID));";
  t_ERRORES: string = "CREATE TABLE IF NOT EXISTS ERRORES(detalle TEXT NOT NULL, mensaje TEXT NOT NULL);";

  ins_USER: string = "INSERT OR IGNORE INTO USER(nick, clave, correo, perfil_media) VALUES('Martin123', '123456', 'martin123@correo.cl', NULL);";
  ins_ESTADO: string = "INSERT OR IGNORE INTO ESTADO(activo, USER_userID) VALUES(7, 1);"; 
  ins_BIBLIOTECA: string = "INSERT OR IGNORE INTO BIBLIOTECA(espacio_disponible, USER_userID) VALUES(900, 1);";
  ins_CARPETA: string = "INSERT OR IGNORE INTO CARPETA(nombre, creacion_date, BIBLIOTECA_bibliotecaID) VALUES('summon_nube', date('now'), 1);";
  ins_ARCHIVO: string = "INSERT OR IGNORE INTO ARCHIVO(nombre, tamaño, filepath_arc, tipo_archivo, subida_date, CARPETA_carpetaID, CARPETA_BIBLIOTECA_bibliotecaID) VALUES('prestock1', 1024, 'assets/images/editor.png', 'image', date('now'), 1, 1);";
  ins_GRUPO: string = "INSERT OR IGNORE INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES('GrupoAdmin', 123456, 'Grupo de administración', date('now'), 1);";
  ins_GRUPO2: string = "INSERT OR IGNORE INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES('GrupoAdmin2', 333666, 'Grupo de administración2', date('now'), 1);";
  ins_PARTICIPANTE: string = "INSERT OR IGNORE INTO PARTICIPANTE(USER_userID, GRUPO_grupoID) VALUES(1, 1);"; 
  ins_PARTICIPANTE2: string = "INSERT OR IGNORE INTO PARTICIPANTE(USER_userID, GRUPO_grupoID) VALUES(1, 2);"; 

//
  //variables para guardar los registros resultantes de un select. l = Listado
  lUser = new BehaviorSubject<User[]>([]);

  //ESTADO Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform,private alerta: AlertService, private nativeStorage: NativeStorage,private http: HttpClient, private router: Router){
        this.platform.ready().then(()=>{
        this.crearDB();
      })
   }
  
  dbState(){
    return this.isDBReady.asObservable();
  }

   crearDB(){
      //procedemos a crear la Base de Datos
      this.sqlite.create({
        name: 'summondb3',
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
      console.log("Tabla t_USER created");
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
      await this.database.executeSql(this.t_ERRORES,[]);
      //generamos los insert en caso que existan
      await this.database.executeSql(this.ins_USER, []);
      await this.database.executeSql(this.ins_ESTADO, []);
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

  ListaUser(){
    return this.database.executeSql('SELECT * from USER',[]).then(res=>{
      //variable para almacenar el resultado de la consulta
      let usuarios: User[] = [];
      //verificar si tenemos registros en la consulta
      if(res.rows.length > 0){
        //recorro el resultado
        for(var i = 0; i < res.rows.length; i++){
          //agregar el registro a mi variable
          usuarios.push({
          userID: res.rows.item(i).userID,
          nick: res.rows.item(i).nick,
          clave: "PRIVADO",
          correo: res.rows.item(i).correo,
          perfil_media: res.rows.item(i).perfil_media,
        });
        }
      }
      this.lUser.next(usuarios as any);
    })
  }

  ListaGrupos(): Observable<any[]> {
    const CONSULTA = `
    SELECT G.grupoID, G.nombre_sala, U.nick AS oNick, COUNT(P.USER_userID) AS totalParticipantes
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

  async getNick(): Promise<string | null> {
    try {
        const userData = await this.nativeStorage.getItem('userData');
        return userData?.nick || null;
    } catch (error) {
        console.error("Error retrieving nickname from Native Storage:", error);
        return null;
    }
  }

  fetchUser(nick: string): Observable<User[]> {
    this.setNick(nick);
    return new Observable(observer => {
      this.database.executeSql('SELECT userID, nick, clave, correo, perfil_media FROM USER WHERE nick = ?', [nick])
        .then(res => {
          let fetchedUser: User[] = [];
          
          if (res.rows.length > 0) {
            fetchedUser.push({
              userID: res.rows.item(0).userID,
              nick: res.rows.item(0).nick,
              clave: res.rows.item(0).clave,
              correo: res.rows.item(0).correo,
              perfil_media: res.rows.item(0).perfil_media,
              
            });
          }
          observer.next(fetchedUser);
          observer.complete();
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }


  // FUNLOGIN
   public async validaClave(nick: string): Promise<string | null> {
    const result = await this.database.executeSql('SELECT clave FROM USER WHERE nick = ?;', [nick]);

    if (result.rows.length > 0) {
      const password = result.rows.item(0).clave;
      await this.savePass(password);
      return password;
    } else {
      return null;
    }
  }
  private async savePass(password: string) {
    try {
      await this.nativeStorage.setItem('IClave', { Vclave: password });
      console.log('Clave guardada');
    } catch (error) {
      console.error('Error guardando clave', error);
    }
  }

  public async getPass(): Promise<string | null> {
    try {
      const data = await this.nativeStorage.getItem('IClave');
      return data.Vclave;
    } catch (error){
      console.error('Error recuperando pass', error);
      return null;
    }
  }
  
  // FUNREGISTRO
  async Unico(Vnick: string, Vcorreo: string): Promise<boolean> {
    const userCheck = await this.database.executeSql('SELECT * FROM USER WHERE nick = ? OR correo = ?;', [Vnick, Vcorreo]);
    return userCheck.rows.length === 0; // Si no hay filas, el usuario es único.
  }

  async registerUser(nick: string, Vcorreo: string, Vpassword: string): Promise<boolean> {
    try {
      // Paso 2: Iniciar transacción para inserciones
      await this.database.transaction(async (reg) => {
        // Insertar el usuario
        const result = await reg.executeSql('INSERT INTO USER(nick, clave, correo) VALUES (?, ?, ?);', [nick, Vpassword, Vcorreo]);
        const userid = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?;', [nick]);
        // Insertar en BIBLIOTECA
        await reg.executeSql('INSERT INTO BIBLIOTECA(espacio_disponible, USER_userID) VALUES (900, ?);', [userid]);
        // Insertar la carpeta por defecto "summon_nube"
        await reg.executeSql('INSERT INTO CARPETA(nombre, creacion_date, BIBLIOTECA_bibliotecaID) VALUES (?, date("now"), ?)', ['summon_nube', userid]);
        // Insertar estado (activo = 1)
        await reg.executeSql('INSERT INTO ESTADO(activo, USER_userID) VALUES (?, ?)', [1, userid]);
  
        
      });
      this.alerta.presentAlert("Funcion registro", "Registro exitoso.");
      return true; // Registro exitoso
    } catch (e: any) {
      // Manejar errores y registrar en la tabla ERRORES
      const eMessage = e.message || "Error desconocido durante el registro.";
      const eCode = e.code;
      await this.logError(eMessage, eCode);
      this.alerta.presentAlert("Registro de usuario", "Error en el registro");
      return false; // Fallo en el registro
    }
  }


  // Registrar Errores
  logError(x: any, z: any){
    this.database.executeSql('INSERT INTO ERRORES VALUES(?,?),;', [x, z])
  }

  // INSERTS

  // Genero con http de la imagen para convertirlo en Uint8array (comaptible de blob sqlite)
  async blobimg(): Promise<Uint8Array> {
    const response = await firstValueFrom(this.http.get('assets/images/def_profile.png', { responseType: 'blob' }));
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);  
  }


  // Verificar inserts
  insertSala(gnombre: string, gclave: number, gdescripcion: string, gowner: number){
      return this.database.executeSql('INSERT INTO GRUPO(nombre_sala, clave, descripcion, fechacreado, owner) VALUES (?,?,?,date(now))',[gnombre,gclave,gdescripcion,gowner]).then(res=>{
        this.alerta.presentAlert("Creación de sala", "Proceso exitoso");
      }).catch(e=>{
        this.alerta.presentAlert("Creación de sala", "Error: " + JSON.stringify(e));
      })
    }
  
  async  insertParticipante(userID: number, grupoID: number){
    try {
      await this.database.executeSql('INSERT INTO PARTICIPANTE (USER_userID, GRUPO_grupoID) VALUES (?, ?)',[userID, grupoID]
      );
      this.alerta.presentAlert("Ingreso a sala ID#" + grupoID, "Con exito");
    } catch (e) {
      this.alerta.presentAlert("Ingreso a sala ID#" + grupoID, "Error: " + JSON.stringify(e));
    }
  }
  

  async insertGrupo(nombre: string, descr: string, clave: number, userID: number){
  try {
  const result = await this.database.executeSql('INSERT INTO GRUPO (nombre_sala, clave, descripcion, fechacreado, owner_id) VALUES (?, ?, ?,date(now), ?)',[nombre, clave, descr, userID]
  );
  this.router.navigate(['/sala', result.insertId]);
    } catch (e) {
  console.error('Error al crear el grupo:', e);
  throw e; // Enviamos el error a funcion valida
}
  }

  //getters
  getPassGrupo(id: number){
    return this.database.executeSql('SELECT clave FROM GRUPO WHERE grupoID= ?',[id]).then(res=>{
    }).catch(e=>{
      this.alerta.presentAlert("Valida Get Clave", "Error: " + JSON.stringify(e));
    })
  }
}