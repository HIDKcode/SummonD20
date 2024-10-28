export class User {
    userID!: number;              
    nick!: string;               
    clave!: string;              
    correo!: string;            
    perfil_media!: Blob;  
    activo?: number;     
}

export class ULT_CONEX {
    conexID!: number;       
    conexDATE!: string;        
    USER_userID!: number;    
}

export class ESTADO {
    activo!: boolean;          
    USER_userID!: number;        
}

export class BENEFICIO {
    beneficioID!: number;       
    page_date!: string;      
    USER_userID!: number;   
}

export class BIBLIOTECA {
    bibliotecaID!: number;      
    espacio_disponible!: number; 
    USER_userID!: number;   
}

export class CARPETA {
    carpetaID!: number;   
    parent_carpetaID!: number; 
    nombre!: string; 
    creacion_date!: string;       
    BIBLIOTECA_bibliotecaID!: number; 
    parent_BIBLIOTECA_bibliotecaID!: number;
}

export class ARCHIVO {
    archivoID!: number;        
    nombre!: string;         
    tamaño!: number;  
    filepath_arc!: string;
    tipo_archivo!: string; 
    subida_date!: string;
    CARPETA_carpetaID!: number;
    CARPETA_BIBLIOTECA_bibliotecaID!: number;
}

export class GRUPO {
    grupoID!: number;
    nombre_sala!: string; 
    clave!: string;
    descripcion!: string; 
    fechacreado!: string;
    owner!: number;
}

export class PARTICIPANTE {
    participanteID!: number;
    USER_userID!: number;
    GRUPO_grupoID!: number;
}

export class MENSAJE {
    msjID!: number;
    msj_autor!: string;
    msj_texto!: string;
    msj_media!: string;
    msj_date!: string;
    PARTICIPANTE_participanteID!: number;
}

export class ADJUNTO {
    mediaID!: number; 
    enviado_date!: string;
    filepath_msj!: string;        
    media_tipo!: string;        
    MENSAJE_msjID!: number;       
}