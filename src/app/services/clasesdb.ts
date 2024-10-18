
// TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS").
export class User{
    userID!: number;
    clave!: string;
    email!: string;
    perfil_media!: Blob;
}

export class ULT_CONEX{
    conexID!: number;
    conexDATE!: Text;
    USER_userID!: number;
}

export class ESTADO{
    activo!: boolean;
    USER_userID!: number;
}

export class BENEFICIO{
    beneficioID!: number;
    page_date!: Text;
    USER_userID!: number;
}
export class BIBLIOTECA{
    bibliotecaID!: number;
    espacio_disponible!: number;
    USER_userID!: number;
}
export class CARPETA{
    carpetaID!: number;
    parent_carpetaID!: number;
    nombre!: string;
    creacion_date!: Text;
    BIBLIOTECA_bibliotecaID!: number;
    parent_BIBLIOTECA_bibliotecaID!: number;
}
export class ARCHIVO{
    archivoID!: number;
    nombre!: String;
    tamaño!: number;
    filepath_arc!: string;
    tipo_archivo!: Text;
    subida_date!: Text;
    CARPETA_carpetaID!: number;
    CARPETA_BIBLIOTECA_bibliotecaID!: number;
    
}
export class GRUPO{
    grupoID!: number;
    clave!: String;
    descripcion!: string;
    fechacreado!: Text;
}
export default class PARTICIPANTE{
    participanteID!: number;
    USER_userID!: number;
    GRUPO_grupoID!: number;
}
export class MENSAJE{ 
    msjID!: number;
    msj_autor!: string;
    msj_texto!: string;
    msj_media!: Text;
    msj_date!: Text;
    PARTICIPANTE_participanteID!: number;
}

export class ADJUNTO{
    mediaID!: number;
    enviado_date!: Text;
    filepath_msj!: string;
    media_tipo!: Text;
    MENSAJE_msjID!: number;
}