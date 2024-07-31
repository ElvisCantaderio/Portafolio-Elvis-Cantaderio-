const hoy = new Date();
hoy.toISOString();
export const formatoFecha = (fecha, formato) => {

    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    if(map.mm < 10){
        map.mm = '0'+map.mm
    }
    if(map.dd < 10){
        map.dd = '0'+ map.dd;
    }
    return formato.replace(/yyyy|mm|dd|yy/gi, matched => map[matched])
}

export default formatoFecha(hoy, 'yyyy-mm-dd');
