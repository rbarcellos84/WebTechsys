WebTechsys - Dashboard de Gestão de Pedidos (v2026)
Este projeto é um ecossistema moderno para gestão de pedidos, utilizando Angular 19 no frontend e .NET 8/9 no backend com persistência em MongoDB.

Sobre o Projeto
O sistema oferece uma interface de alta performance para monitoramento de logística, apresentando:

Gráfico de Distribuição: Visualização em tempo real do status dos pedidos via Chart.js.

Gestão de Dados: Tabela dinâmica com suporte a grandes volumes de pedidos.

Detalhes Avançados: Painel inferior com tipografia otimizada para leitura técnica de SKUs.

Organização e Arquitetura
Frontend (Angular 19)
Standalone Architecture: Utilização de componentes independentes, eliminando a necessidade de AppModule.

Sinalização de Estado (Signals): Gerenciamento de estado reativo para atualizações instantâneas no painel de detalhes.

Layout Flexível: Uso de calc(100% - 400px) para garantir que o painel de detalhes ocupe toda a largura útil da tela.

Backend (.NET)
REST API: Endpoints otimizados para entrega de JSON compatível com o MongoDB.

CORS Policy: Configurado para aceitar requisições de http://localhost:4200.

Bibliotecas Instaladas
Frontend (Angular 19)
@angular/core, @angular/common: Núcleo do framework v19.

ng2-charts & chart.js: Para renderização dos gráficos de pizza/donuts.

rxjs: Gerenciamento de chamadas assíncronas à API.

Backend & Banco de Dados
MongoDB.Driver: Driver oficial para comunicação com o NoSQL.

ASP.NET Core Runtime: Hosting da API na porta 7223.

Como Rodar o Projeto
MongoDB: Deve estar ativo em localhost:27017.

API (.NET):

Bash

dotnet run
# Endpoint: https://localhost:7223/api
Frontend (Angular 19):

Bash

npm install
ng serve
# Acesse: http://localhost:4200