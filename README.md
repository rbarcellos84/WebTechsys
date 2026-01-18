TechsysLog - Sistema de Gestão Logística

Este projeto é um ecossistema moderno para gestão de pedidos, utilizando Angular 19 no frontend e .NET 8 no backend com persistência em MongoDB. O sistema oferece uma interface de alta performance para monitoramento de logística com gráficos em tempo real e gestão dinâmica de dados.



Arquitetura e Tecnologias

Backend (.NET 8)

Clean Architecture: Desacoplamento total entre lógica de negócio e infraestrutura.



CQRS: Separação clara entre comandos de escrita e consultas de leitura.



MongoDB Driver: Comunicação otimizada com banco NoSQL.



Global Exception Handling: Respostas JSON padronizadas via ApiExceptionFilter.



Frontend (Angular 19)

Standalone Components: Arquitetura moderna sem AppModule, aumentando a modularidade.



Signals: Gerenciamento de estado reativo para atualizações instantâneas na interface.



Chart.js: Renderização dinâmica de gráficos de distribuição de pedidos.



Layout Flexível: Design responsivo utilizando CSS Grid e Flexbox.



Como Executar com Docker (Recomendado)

O Docker garante que o projeto rode perfeitamente em qualquer máquina, orquestrando o Nginx, a API e o MongoDB de forma automática.



Passo a Passo

Gere o Build do Angular: Na pasta WebTechsys, instale as bibliotecas e gere os arquivos de produção:



Bash



npm install

ng build

Suba os Containers: Na raiz do projeto (onde está o docker-compose.yml), execute:



Bash



docker-compose up -d --build

Endereços de Acesso:



Dashboard (Frontend): http://localhost:4200



Swagger (API Documentation): http://localhost:7223/swagger/index.html



MongoDB: mongodb://localhost:27017



Configuração Manual (Sem Docker)

MongoDB: Certifique-se de que o banco está rodando em localhost:27017.



API: No arquivo appsettings.json, ajuste a conexão:



JSON



"MongoDbSettings": {

&nbsp; "ConnectionString": "mongodb://localhost:27017/",

&nbsp; "DatabaseName": "TechsysLogDB"

}

Comandos:



Bash



\# Na pasta da API

dotnet run



\# Na pasta do Frontend

ng serve

Resolução de Problemas (Troubleshooting)

Erro 403 Forbidden: Ocorre se você tentar rodar o Docker sem antes ter executado o ng build no Angular.



Connection Refused (API): Verifique nos logs se a API conseguiu encontrar o serviço do banco:



Bash



docker logs api-techsys-container

CORS: A API está configurada para aceitar requisições de http://localhost:4200.





