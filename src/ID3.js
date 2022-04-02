'use strict'

export default class ID3 {

	constructor(atributos, juego, valorSi, valorNo, camino) {
		this.atributos = atributos.replace(/(\r\n|\n|\r)/gm, '').split(',');
		this.juego = juego.split('\n');
		this.juego = this.juego.map(line => line.replace('\r', ''));
		this.juego = this.juego.filter(line => line.length > 0);
		this.juego = this.juego.map(line => line.split(','));
		this.valorSi = valorSi.toUpperCase();
		this.valorNo = valorNo.toUpperCase();
		this.raiz = {pasaCamino: true};
		this.camino = camino;
		this.id3(this.raiz, this.atributos, this.juego);
	}

	valoresColumna(col, ejemplos){
		const mapa = new Map();
		for (var i = 0; i < ejemplos.length; i++) {
			if (mapa.has(ejemplos[i][col])) {
				mapa.set(ejemplos[i][col], mapa.get(ejemplos[i][col]) + 1);
			} else {
				mapa.set(ejemplos[i][col], 1);
			}
		}

		let iterator = mapa.keys();
		let value = iterator.next();
		const arr = [];

		while (!value.done) {
  			arr.push({value: value.value, count: mapa.get(value.value)});
  			value = iterator.next();
		}

		return arr;
	}

	calculoPositivos(valor, col, atributos, ejemplos){
		var cont = 0;

		for(var i=0; i<ejemplos.length; i++){
			if(ejemplos[i][col] === valor && ejemplos[i][atributos.length-1].toUpperCase() === this.valorSi)
				cont++;
		}
		return cont;
	}

	calculoNegativos(valor, col, atributos, ejemplos){
		var cont = 0;

		for(var i=0; i<ejemplos.length; i++){
			if(ejemplos[i][col] === valor && ejemplos[i][atributos.length-1].toUpperCase() === this.valorNo)
				cont++;
		}
		return cont;
	}


	meritoColumna(col, atributos, ejemplos){
		const arr = this.valoresColumna(col, ejemplos);
		let merito = 0;
		for(var i = 0; i < arr.length; i++){
			let valor = arr[i].value;
			var suma = arr.find(a => a.value === valor).count;
			var r = suma/ejemplos.length;
			merito += r * this.entropia((this.calculoPositivos(valor, col, atributos, ejemplos)/suma),(this.calculoNegativos(valor, col, atributos, ejemplos)/suma));
		}
		return merito;
	}

	entropia(p, n) {	//Arreglar esto para que no devuelva NaN cuando alguno de los dos es 0
		if (p === 0 || n === 0) return 0;
		else return -1 * p * Math.log2(p) - n * Math.log2(n);
	}

	todosEjemplosPositivos(atributos, ejemplos) {
		return ejemplos.find(ejemplo => ejemplo[atributos.length - 1].toUpperCase() === this.valorNo) === undefined;
	}

	todosEjemplosNegativos(atributos, ejemplos) {
		return ejemplos.find(ejemplo => ejemplo[atributos.length - 1].toUpperCase() === this.valorSi) === undefined;
	}

	id3(vertice, atributos, ejemplos) {
		if (this.juego.length === 0) return;
		else if (this.todosEjemplosPositivos(atributos, ejemplos)) vertice.nombre = this.valorSi;
		else if (this.todosEjemplosNegativos(atributos, ejemplos)) vertice.nombre = this.valorNo;
		else if (atributos.length === 0) new Error();
		else {
			let mejorAtributo;
			let mejorAtributoIndex;
			let mejorMerito = Number.POSITIVE_INFINITY;
			atributos.forEach((atributo, index) => {
				if (index < atributos.length - 1) {
					const merito = this.meritoColumna(index, atributos, ejemplos);
					if (merito < mejorMerito) {
						mejorAtributo = atributo;
						mejorAtributoIndex = index;
						mejorMerito = merito;
					}
				}
			});
			const _atributos = atributos.filter(atributo => atributo !== mejorAtributo);

			vertice.nombre = mejorAtributo;
			vertice.aristas = [];

			const mejorAtributoOriginalIndex = this.atributos.findIndex(atributo => atributo === mejorAtributo);

			const valoresColumna = this.valoresColumna(mejorAtributoIndex, ejemplos);
			valoresColumna.forEach(valor => {
				let ejemplosHijo = ejemplos.filter(ejemplo => ejemplo[mejorAtributoIndex] === valor.value);
				ejemplosHijo = ejemplosHijo.map(ejemplo => {
					ejemplo = JSON.parse(JSON.stringify(ejemplo));
					ejemplo.splice(mejorAtributoIndex, 1);
					return ejemplo;
				});

				let valorCamino;
				if (vertice.pasaCamino && this.camino.has(mejorAtributoOriginalIndex) && this.camino.get(mejorAtributoOriginalIndex) === valor.value) {
					valorCamino = this.camino.get(mejorAtributoOriginalIndex);
					this.camino.delete(mejorAtributoOriginalIndex);
				}

				const arista = {nombre: valor.value, vertice: {pasaCamino: !!valorCamino}, pasaCamino: valor.value === valorCamino};
				this.id3(arista.vertice, _atributos, JSON.parse(JSON.stringify(ejemplosHijo)));
				vertice.aristas.push(arista);
			});
		}
	}

	toConsole() {
		this._toConsole(this.raiz);
	}

	_toConsole(vertice) {
		if (vertice) {
			const pendientes = [];
			pendientes.push(vertice);
			while (pendientes.length > 0) {
				const sig = pendientes.shift();
				console.log(sig);

				if (sig.aristas)
					sig.aristas.forEach(arista => pendientes.push(arista.vertice));
			}
		}
	}
}
