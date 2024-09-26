// models/Restaurante.js

class Restaurante {
    constructor(ID, dono, nome, CNPJ, lucro, email, senha, endereco, telefone) {    
        this.ID = ID;
        this.dono = dono;
        this.nome = nome;
        this.CNPJ = CNPJ;
        this.lucro = lucro;
        this.email = email;
        this.senha = senha;
        this.endereco = endereco;
        this.telefone = telefone;  
    }

    // Método para apresentar as informações do restaurante
    apresentar() {
        return `Nome: ${this.nome}, Email: ${this.email}`;
    }
}

module.exports = Restaurante;
