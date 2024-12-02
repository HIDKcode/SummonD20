import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from './alert.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { User, Grupo, Participante, Mensaje, Archivo } from './clasesdb';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public database!: SQLiteObject

  //varaibles any
  Vvalida: any;
  isLogged = false;

  userID!: number;
  clave!: string;
  correo!: string;
  perfil_media!: Blob;

  // Estado 0 Bloqueado, 1 Usuario contraseña temporal, 5 Usuario permitido, 9 Admin.
  t_USER: string = "CREATE TABLE IF NOT EXISTS USER(userID INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT NOT NULL UNIQUE, clave TEXT NOT NULL, correo TEXT NOT NULL UNIQUE, perfil_media BLOB, estado INTEGER NOT NULL);";
  t_BENEFICIO: string = "CREATE TABLE IF NOT EXISTS BENEFICIO(beneficioID INTEGER PRIMARY KEY AUTOINCREMENT, pago_date TEXT NOT NULL, USER_userID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_BIBLIOTECA: string = "CREATE TABLE IF NOT EXISTS BIBLIOTECA(USER_userID INTEGER PRIMARY KEY, espacio_disponible INTEGER NOT NULL, FOREIGN KEY (USER_userID) REFERENCES USER(userID));";
  t_ARCHIVO: string = "CREATE TABLE IF NOT EXISTS ARCHIVO(archivoID INTEGER PRIMARY KEY AUTOINCREMENT, archivo BLOB, nombre TEXT, extension TEXT NOT NULL, tamaño INTEGER NOT NULL, subida_date TEXT NOT NULL, bibliotecaID INTEGER NOT NULL, FOREIGN KEY (bibliotecaID) REFERENCES BIBLIOTECA(bibliotecaID));"; 
  t_GRUPO: string = "CREATE TABLE IF NOT EXISTS GRUPO(grupoID INTEGER PRIMARY KEY AUTOINCREMENT,nombre_sala TEXT NOT NULL UNIQUE,clave INTEGER NOT NULL,descripcion TEXT,owner INTEGER NOT NULL);";
  t_PARTICIPANTE: string = "CREATE TABLE IF NOT EXISTS PARTICIPANTE(participanteID INTEGER PRIMARY KEY AUTOINCREMENT,USER_userID INTEGER, GRUPO_grupoID INTEGER, FOREIGN KEY (USER_userID) REFERENCES USER(userID),FOREIGN KEY (GRUPO_grupoID) REFERENCES GRUPO(grupoID), UNIQUE (USER_userID, GRUPO_grupoID));";
  // mensaje media es un ID que copia el ID de archivo.
  t_MENSAJE: string = "CREATE TABLE IF NOT EXISTS MENSAJE(msjID INTEGER PRIMARY KEY AUTOINCREMENT,msj_autor TEXT NOT NULL,msj_texto TEXT NOT NULL, msj_media BLOB,msj_date TEXT NOT NULL,PARTICIPANTE_participanteID INTEGER,FOREIGN KEY (PARTICIPANTE_participanteID) REFERENCES PARTICIPANTE(participanteID));";
  t_ERRORES: string = "CREATE TABLE IF NOT EXISTS ERRORES(detalle TEXT NOT NULL, mensaje TEXT NOT NULL);";
  t_RECUPERAR: string = "CREATE TABLE IF NOT EXISTS RECUPERAR(userID INTEGER PRIMARY KEY NOT NULL, codigo_seguridad TEXT, FOREIGN KEY (userID) REFERENCES USER(userID));";

  ins_USER: string = "INSERT OR IGNORE INTO USER(nick, clave, correo, perfil_media, estado) VALUES('martin123', '123456', 'shun.okikura@gmail.cl', NULL, 9);";
  ins_BIBLIOTECA: string = "INSERT OR IGNORE INTO BIBLIOTECA(USER_userID, espacio_disponible) VALUES(1, 900);";
  ins_ARCHIVO: string = "INSERT OR IGNORE INTO ARCHIVO(nombre, extension, tamaño, subida_date, bibliotecaID) VALUES('archivo', 'png', 24, date('now'), 1);";
  ins_GRUPO: string = "INSERT OR IGNORE INTO GRUPO(nombre_sala, clave, descripcion, owner) VALUES('GrupoAdmin', 123456, 'Grupo de administración', 1);";
  ins_GRUPO2: string = "INSERT OR IGNORE INTO GRUPO(nombre_sala, clave, descripcion, owner) VALUES('GrupoAdmin2', 333666, 'Grupo de administración2', 1);";
  ins_PARTICIPANTE: string = "INSERT OR IGNORE INTO PARTICIPANTE(USER_userID, GRUPO_grupoID) VALUES(1, 1);"; 
  ins_PARTICIPANTE2: string = "INSERT OR IGNORE INTO PARTICIPANTE(USER_userID, GRUPO_grupoID) VALUES(1, 2);"; 
  
  //ESTADO Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  //Variable para guardar registros resultantes de select
  listadomisgrupos = new BehaviorSubject([]);
  listadogrupos = new BehaviorSubject([]);
  listadoparticipantes = new BehaviorSubject([]);
  listadomensajes = new BehaviorSubject([]);
  listadoarchivos = new BehaviorSubject([]);

  constructor(private sqlite: SQLite, private platform: Platform,private alerta: AlertService,
      private nativeStorage: NativeStorage, private router: Router, private nativestorage: NativeStorage){
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
        name: 'summonBetaV16',
        location:'default'
      }).then((db: SQLiteObject)=>{
        //capturar y guardar la conexión a la Base de Datos
        this.database = db;
        //llamar a la función de creación de tablas
        this.crearTablas();
        this.consultagrupos();
        //modificar el observable del status de la base de datos
        this.isDBReady.next(true);
      }).catch(e=>{
        this.alerta.presentAlert("Creación de BD", "Error creando la BD");
      })
    
   }


async crearTablas(){
    try{
      //mandar a ejecutar las tablas en el orden especifico
      await this.database.executeSql(this.t_USER,[]);
      await this.database.executeSql(this.t_BENEFICIO,[]);
      await this.database.executeSql(this.t_BIBLIOTECA,[]);
      await this.database.executeSql(this.t_ARCHIVO,[]);
      await this.database.executeSql(this.t_GRUPO,[]);
      await this.database.executeSql(this.t_PARTICIPANTE,[]);
      await this.database.executeSql(this.t_MENSAJE,[]);
      await this.database.executeSql(this.t_ERRORES,[]);
      await this.database.executeSql(this.t_RECUPERAR,[]);
      //generamos los insert en caso que existan
      await this.database.executeSql(this.ins_USER, []);
      await this.database.executeSql(this.ins_BIBLIOTECA, []);
      await this.database.executeSql(this.ins_ARCHIVO, []);
      await this.database.executeSql(this.ins_GRUPO, []);
      await this.database.executeSql(this.ins_PARTICIPANTE, []);
      await this.database.executeSql(this.ins_GRUPO2, []);
      await this.database.executeSql(this.ins_PARTICIPANTE2, []);
    }catch(e: any){
      this.alerta.presentAlert("Error en sistema", "Contacte soporte o reintente por error SUMMON-DB01");
    }
  }


  async setNick(nick: string){
    await this.nativeStorage.setItem('userData', { nick });
  }

// Lista de usuarios

  ListaUsers(): Observable<User[]> {
    const CONSULTA = `SELECT userID, nick, correo, perfil_media, estado
    FROM USER;`;
    
    return new Observable(MIRAUSER => {
      this.database.executeSql(CONSULTA, []).then(res => {
          const USUARIO = [];
          for (let i = 0; i < res.rows.length; i++) {
            USUARIO.push(res.rows.item(i));
          }
          MIRAUSER.next(USUARIO);
          MIRAUSER.complete();
        })
        .catch(error => MIRAUSER.error(error));
    });
  }
  
  async consultaparticipantes(grupoID: number){
    try{
      const CONSULTA = `
      SELECT participanteID, nick, perfil_media
      FROM PARTICIPANTE PA
      LEFT JOIN USER US ON PA.USER_userID = US.userID
      WHERE PA.GRUPO_grupoID = ?
      `;
      return this.database.executeSql(CONSULTA, [grupoID]).then(res=>{
        let items: Participante[] = [];
        if (res.rows.length > 0) {
          for(let i = 0; i < res.rows.length; i++){
            items.push({
              participanteID: res.rows.item(i).participanteID,
              nick: res.rows.item(i).nick,
              perfil_media: res.rows.item(i).perfil_media,
            });
          }
          this.listadoparticipantes.next(items as any);
        }
      })
    } catch (e: any){
      this.logError("consultaparticipantes", e.code ||': '|| e.message);
      this.alerta.presentAlert("Error en sistema", "Contacte soporte o reintente por error SUMMON-CMP01");
    }
  }

  async consultamisgrupos(nick: string) {
    try {
      // Obtener el userID de forma asíncrona
      const userID = await this.getID(nick); 
      
      const CONSULTA = `
      SELECT g.grupoID, g.nombre_sala, g.descripcion, u.nick
      FROM GRUPO g
      LEFT JOIN USER u ON g.owner = u.userID
      WHERE g.grupoID IN (
        SELECT p.GRUPO_grupoID
        FROM PARTICIPANTE p
        WHERE p.USER_userID = ?
        )
      OR g.owner = ?
      `;
      
      // Ejecutar la consulta de grupos con el userID
      return this.database.executeSql(CONSULTA, [userID, userID]).then(res => {
        let items: Grupo[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            items.push({
              grupoID: res.rows.item(i).grupoID,
              nombre_sala: res.rows.item(i).nombre_sala,
              descripcion: res.rows.item(i).descripcion,
              owner: res.rows.item(i).nick,
            });
          }
        }
        this.listadomisgrupos.next(items as any);
      });
    } catch (e: any) {
      this.logError("consultamisgrupos", e.code ||': '|| e.message);
      this.alerta.presentAlert("Error en sistema", "Contacte soporte o reintente por error SUMMON-CMG01");
    }
  }

  consultagrupos(){
    const CONSULTA = `
    SELECT grupoID, nombre_sala, descripcion, nick
    FROM GRUPO G
    JOIN USER U ON G.owner = U.userID
    `;
    
    return this.database.executeSql(CONSULTA,[]).then(res =>{
      let items: Grupo[] = [];
      if(res.rows.length > 0){
        for(let i = 0; i < res.rows.length; i++){
          items.push({
            grupoID: res.rows.item(i).grupoID,
            nombre_sala: res.rows.item(i).nombre_sala,
            descripcion: res.rows.item(i).descripcion,
            owner: res.rows.item(i).nick,
          })
        }
      }
      this.listadogrupos.next(items as any);
    })
  }

  async consultarmensajes(grupoID: number) {
      const CONSULTA = `
        SELECT 
          msj_autor, msj_texto, msj_date, msj_media
        FROM MENSAJE m
        WHERE m.PARTICIPANTE_participanteID IN (
          SELECT participanteID FROM PARTICIPANTE WHERE GRUPO_grupoID = ?
        )
        ORDER BY m.msj_date ASC
      `;
      return this.database.executeSql(CONSULTA, [grupoID]).then(res => {
        let item: Mensaje [] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            item.push({
              msj_autor: res.rows.item(i).msj_autor,
              msj_texto: res.rows.item(i).msj_texto,
              msj_date: res.rows.item(i).msj_date,
              msj_media: res.rows.item(i).msj_media
            })
          }
        }
        this.listadomensajes.next(item as any);
      });
  }

  async consultaarchivos(bibliotecaID: number){
    const CONSULTA = `
    SELECT 
    archivoID, archivo, extension, tamaño, subida_date
    FROM ARCHIVO 
    WHERE bibliotecaID = ?
    `;
    return this.database.executeSql(CONSULTA, [bibliotecaID]).then(res =>{
      let item: Archivo [] = [];
      if (res.rows.length > 0){
        for (let i = 0; i < res.rows.length; i++){
          item.push({
            archivoID: res.rows.item(i).archivoID,
            archivo: res.rows.item(i).archivo,
            extension: res.rows.item(i).extension,
            tamaño: res.rows.item(i).tamaño,
            subida_date: res.rows.item(i).subida_date,
          })
        }
      }
      this.listadoarchivos.next(item as any);
    })
  }
  

 // Retorno como observables
 fetcharchivos(): Observable<any[]>{
  return this.listadoarchivos.asObservable();
}
 fetchmensajes(): Observable<any[]>{
  return this.listadomensajes.asObservable();
}
  fetchmisgrupos(): Observable<any[]>{
    return this.listadomisgrupos.asObservable();
  }
  fetchgrupos(): Observable<any[]>{
    return this.listadogrupos.asObservable();
  }
  fetchparticipantes(): Observable<any[]>{
    return this.listadoparticipantes.asObservable();
  }
 
  

  fetchUsuario(nick: string): Observable<User[]> {
    const CONSULTA = `
    SELECT userID, nick, correo, perfil_media, estado
    FROM USER
    WHERE nick = ?
    `;
    return new Observable(MIRAUSER => {
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
          }
          MIRAUSER.next(fetchedUser);
          MIRAUSER.complete();
        })
        .catch(e => {
          this.logError("fetchUsuario(variable)", e.code ||': '|| e.message);
          this.alerta.presentAlert("Error en sistema", "Contacte soporte o reintente por error SUMMON-F01");
          MIRAUSER.error(e);
        });
    });
  }

  LoginUser(nick: string) {
    this.isLogged = true;
    this.setNick(nick);
    this.fetchUsuario(nick).subscribe({
      next: (usuarios: User[]) => {
        if (usuarios.length < 1) {
          this.alerta.presentAlert("Usuario no encontrado", "Redirigiendo a ingreso");
          this.nativeStorage.remove('userData');
          this.router.navigate(['/login']);
        }
      },
      error: (e: any) => {
        this.logError("LoginUser", e.code ||': '|| e.message);
        this.alerta.presentAlert("Error de sistema", "Redirigido a ingreso");
        this.router.navigate(['/login']); 
      }
    });
  }
  



// VALIDADORES
  async validaRecuperar(nick: string, correo: string): Promise<boolean> {
    const CONSULTA = await this.database.executeSql('SELECT COUNT(*) as count FROM USER WHERE nick = ? AND correo = ?', [nick, correo]);

    if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).count > 0) {
      return true;
    } else {
      return false;
    }
  }

  async validaClave(nick: string, clave: string): Promise<boolean> {
    const CONSULTA = await this.database.executeSql('SELECT COUNT(*) as count FROM USER WHERE nick = ? AND clave = ?', [nick, clave]);

    if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).count > 0) {
      return true;
    } else {
      return false;
    }
  }

  async validaClaveGrupo(id: number, pass: number): Promise<boolean>{
    const CONSULTA = await this.database.executeSql('SELECT COUNT(*) as count FROM GRUPO WHERE grupoID = ? AND clave = ?',[id, pass]);

    if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).count > 0) {
      return true;
    } else {
      return false;
    }
  }

  async validaCodigo(codigo: string): Promise<boolean>{
    const CONSULTA = await this.database.executeSql('SELECT COUNT(*) as count FROM RECUPERAR WHERE codigo_seguridad = ?',[codigo])
    
    if (CONSULTA.rows.length > 0 && CONSULTA.rows.item(0).count > 0) {
      return true;
    } else {
      return false;
    }
  }

  async Unico(Vnick: string, Vcorreo: string): Promise<boolean> {
    const CONSULTA = await this.database.executeSql('SELECT * FROM USER WHERE nick = ? OR correo = ?', [Vnick, Vcorreo]);
    // Si row.length === 0 es porque el usuario no existe, UNICO true, ver qué debe entregar y como recepcionar el TRUE
    if (CONSULTA.rows.length === 0) {
      return true;
    } else {
      return false;
    }
  }
 
  async UnicoGrupo(x: string): Promise<boolean> {
    const CONSULTA = await this.database.executeSql('SELECT * FROM GRUPO WHERE nombre_sala = ?', [x]);
    // Si row.length === 0 es porque el usuario no existe, UNICO true, ver qué debe entregar y como recepcionar el TRUE
    if (CONSULTA.rows.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  acceso(){
    if (this.isLogged){
      return;
    } else {
      this.alerta.presentAlert("Verificación de acceso","Fallo al verificar credencial de usuario, contacte soporte.")
      this.router.navigate(['/login']);
    }
  }

 // GETTERS o SELECTS 
  async getID(nick: string) {
  const SELECT = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?', [nick]);
  if (SELECT.rows.length > 0) {
    return SELECT.rows.item(0).userID;
   } 
  }
  
  async getOWNER(grupoID: number){
    const SELECT = await this.database.executeSql('SELECT owner FROM GRUPO WHERE grupoID = ?',[grupoID]);
    if (SELECT.rows.length > 0){
      return SELECT.rows.item(0).nombre_sala;
    } else {
      this.alerta.presentAlert("Fallo en get OWNER grupo", "Contacte soporte o reinicie vista.");
    }
  }
  
  async getGrupoNombre(grupoID: number){
    const SELECT = await this.database.executeSql('SELECT nombre_sala FROM GRUPO WHERE grupoID = ?',[grupoID]);
    if (SELECT.rows.length > 0){
      return SELECT.rows.item(0).nombre_sala;
    } else {
      this.alerta.presentAlert("Fallo en get ID grupo", "Contacte soporte o reinicie vista."+grupoID);
    }
  }

// UPDATE
  modificafoto(imgblob: Blob, nick: string){
    return this.database.executeSql('UPDATE USER SET perfil_media = ? WHERE nick = ?',[imgblob, nick]).then(res=>{
      this.alerta.presentAlert("Alerta", "Fotografia modificada");
      this.fetchUsuario(nick);
    }).catch(e=>{
      this.alerta.presentAlert("Error en modificar foto", "Contacte soporte");
      this.logError("modificafoto", e.code ||': '|| e.message);
    })
  }

  modificaCorreo(nick: string, correo: string){
    return this.database.executeSql('UPDATE USER SET correo = ? WHERE nick = ?',[correo, nick]).then(res=>{
      this.alerta.presentAlert("Alerta", "Correo modificado");
      this.fetchUsuario(nick);
    }).catch(e=>{
      this.alerta.presentAlert("Error en modificar correo", "Contacte soporte");
      this.logError("modificacorreo", e.code ||': '|| e.message);
    })
  }

  modificaClave(clave: string, nick: string){
    return this.database.executeSql('UPDATE USER SET clave = ? WHERE nick = ?',[clave, nick]).then(res=>{
      this.alerta.presentAlert("Alerta", "Contraseña modificada");
      this.fetchUsuario(nick);
    }).catch(e=>{
      this.alerta.presentAlert("Error en modificar contraseña", "Contacte soporte");
      this.logError("modificaclave", e.code ||': '|| e.message);
    })
  } 

  modificaEstado(int: number, nick: string){
    const valoresPermitidos = [0, 1, 5, 9];
    if(valoresPermitidos.includes(int)){
      return this.database.executeSql('UPDATE USER SET estado = ? WHERE nick = ?',[int, nick]).then(res=>{
      this.alerta.presentAlert("Alerta", "Contraseña modificada");  
      this.fetchUsuario(nick);
      }).catch(e=>{
        this.alerta.presentAlert("Error en modificar estado", "Contacte soporte");
        this.logError("modificaestado", e.code ||': '|| e.message);
      })
    }
    return;
  }

  
// DELETEmsjMedia
eliminarGrupo(id: number){
  return this.database.executeSql('DELETE FROM GRUPO WHERE grupoID = ?',[id]).then(res=>{
    this.alerta.presentAlert("Eliminar", "Grupo Eliminado");
    this.consultagrupos();
  }).catch(e=>{
    this.alerta.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    this.logError("elimargrupo", e.code ||': '|| e.message);
  })

}

// INSERTS
async enviarMensaje(msjAutor: string, msjTexto: string, msjMedia: Blob, grupoID: number): Promise<void> {
    try {
      const userID = await this.getID(msjAutor);
      const Selectt = await this.database.executeSql(
        'SELECT participanteID FROM PARTICIPANTE WHERE USER_userID = ? AND GRUPO_grupoID = ?',
        [userID, grupoID]
      );
      const Participante = Selectt.rows.item(0).participanteID;

      if (msjMedia) {
      await this.insertarArchivo(msjMedia, msjAutor);  // Insertamos en archivo y obtenemos ID
      }

      const INSERT = `
        INSERT INTO MENSAJE (msj_autor, msj_texto, msj_media, msj_date, PARTICIPANTE_participanteID)
        VALUES (?, ?, ?, date('now'), ?)
      `;

      await this.database.executeSql(INSERT, [msjAutor, msjTexto, msjMedia, Participante]);
      this.consultarmensajes(grupoID);
    } catch (e: any) {
      await this.logError("enviarmensaje", e.code ||': '|| e.message);
    }
  }

  async insertarArchivo(Media: Blob, nick: string): Promise<number | null> {
    try {
      const bibliotecaID = await this.getID(nick);
      const extension = 'png';
      const tamanio = '12';
      const INSERT = `
        INSERT INTO ARCHIVO(archivo, extension, tamaño, subida_date, bibliotecaID)
        VALUES (?, ?, ?, date('now'), ?)
      `;
      
      const result = await this.database.executeSql(INSERT, [Media, extension, tamanio, bibliotecaID]);
      return result.insertId;
    } catch (e: any) {
      await this.logError("insertarchivo", e.code ||': '|| e.message);
      return null;
    }
  }

  logError(title: any, msj: any){
    // Se debe ingresar en title el nombre de la función y en mensaje eCode||': '||eMessage
    this.database.executeSql('INSERT INTO ERRORES VALUES(?,?)', [title, msj])
  }

  async insertarCodigoSeguridad(nick: string, codigo: string){
    try{
      const userid = await this.getID(nick);
      await this.database.executeSql('INSERT INTO RECUPERAR(userID, codigo_seguridad) VALUES(?, ?)', [userid])
    } catch (e: any) {
      await this.logError("insertCodigoSeguridad", e.code ||': '|| e.message);
    }
  }

  async DeleteCodigoSeguridad(nick: string){
    try{
      const userid = await this.getID(nick);
      await this.database.executeSql('DELETE FROM RECUPERAR WHERE userID = ?', [userid])
    } catch (e: any) {
      await this.logError("DeleteCodigoSeguridad", e.code ||': '|| e.message);
    }
  }
  


  async  insertParticipante(nick: string, grupoID: number){
    try {
      const SELECT = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?', [nick]);
      if (SELECT.rows.length > 0) {
        const userID = SELECT.rows.item(0).userID;
      await this.database.executeSql('INSERT OR IGNORE INTO PARTICIPANTE (USER_userID, GRUPO_grupoID) VALUES (?, ?)',[userID, grupoID]);
      this.consultamisgrupos(nick);
      } else {
        this.alerta.presentAlert("Error en registro de participante", "Contacte soporte");
        return;
      }
    } catch (e: any) {
      await this.logError("insertparticipante", e.code ||': '|| e.message);
      this.alerta.presentAlert("Ingreso a sala numero:" + grupoID, "Error, contacte soporte");
    }
  }


  async insertGrupo(nombre: string, descr: string, clave: number, nick: string){
    const VERIFICA = await this.UnicoGrupo(nombre);
    if(VERIFICA){
      try {
        const SELECT = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?', [nick]);
        if (SELECT.rows.length > 0) {
        const userID = SELECT.rows.item(0).userID;
        const CONSULTA = await this.database.executeSql('INSERT INTO GRUPO(nombre_sala, clave, descripcion, owner) VALUES (?, ?, ?, ?)',[nombre, clave, descr, userID]);
        const IDgrupo = await CONSULTA.insertId;
        await this.insertParticipante(nick, IDgrupo);
        this.alerta.presentAlert("Sala creada con exito", "ID del grupo: "+ IDgrupo);
        this.consultagrupos();
        this.consultamisgrupos(nick);
        await this.nativestorage.setItem('grupoData',{IDgrupo});
        await this.router.navigate(['/sala', IDgrupo]);
        } else {
          this.alerta.presentAlert("Error en creación de grupo", "Contacte soporte");
          return;
        }
          } catch (e: any) {
          await this.logError("insertGrupo", e.code ||': '|| e.message);
          }
    } else {
      this.alerta.presentAlert("Fallo en creacion de grupo", "Nombre de grupo ya existe");
    }
  }

// INSERT MODULO REGISTRO
  async registerUser(nick: string, Vcorreo: string, Vpassword: string): Promise<boolean> {
    try {
      // Las alertas funcionarán como console.log en android studio para testing. 5 es = a Usuario permitido
        await this.database.executeSql('INSERT INTO USER(nick, clave, correo, estado) VALUES (?, ?, ?, ?)', [nick, Vpassword, Vcorreo, 5]);
        //this.alerta.presentAlert("1", "a");
        const userCheck = await this.database.executeSql('SELECT userID FROM USER WHERE nick = ?', [nick]);
        //this.alerta.presentAlert("1", "b");
        const userid = userCheck.rows.item(0).userID; // Accede al userID correctamente
        //this.alerta.presentAlert("1", "c");
        await this.database.executeSql('INSERT INTO BIBLIOTECA(USER_userID, espacio_disponible ) VALUES (?, 900)', [userid]);
        this.alerta.presentAlert("Funcion registro", "Registro exitoso.");
        return true; // Registro exitoso
    } catch (e: any) {
      await this.logError("registerUser", e.code ||': '|| e.message);
      this.alerta.presentAlert("Fallo en registro", "Contacte soporte o reintente");
      return false; 
    }
  }

  // UTILIDADES
  generarClaveAleatoria(){
    const longitud = 8;
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const caracteresMayus = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    let clave = caracteresMayus.charAt(Math.floor(Math.random() * caracteresMayus.length));

    for (let i = 1; i < longitud; i++) {
      const charSet = Math.random() < 0.2 ? caracteresMayus : caracteres;
      clave += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return clave.split('').sort(() => 0.5 - Math.random()).join('');
  }

  logoff(){
    this.isLogged = false;
  }

}