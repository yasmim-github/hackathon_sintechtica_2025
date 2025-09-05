
### Escrito na sexta-feira, 5 de agosto, aos 10:13PM ###

Ações:

1. Foi criado um novo arquivo nesse mesmo diretorio, main.js
2. Dei npm install nos pacotes necessários descritos no main.js
3. Foi baixado outros pacotes, como @google/genai e ejs
4. Para usar imagens, scripts e stylesheets usando express, foi feito as seguintes ações:
 4.1. Nome do diretorio que possui imagens e stylesheets é agora se chama "public"
 4.2  Foram atualizados os arquivos HTML que apontam para stylesheets, imagens e scripts de acordo com a documentação para uso em express
5. Todos os arquivos ".HTML" foram mudados para tipo ".ejs" (embedded javascript) assim, cas o usário mandasse alguma coisa,
a página consegue atualizar dinâmicamente (usando res.render)
7. Foi feito o arquivo ".env" e escondido pelo .gitignore, o arquivo ".env" possui nossa chave de API, é de EXTREMA importãncia que 
não fique disponível á ninguém 
8. requirements foi atualizado
9. connect.mjs agora está no mesmo diretório que o main.js está, e foi atualizado.


Pacotes ultilizados em main:
ejs
express
@google/genai
dotenv


Notas:
->> Agora se você quiser visualizar as páginas, escreva "node main.js" nesse diretorio
-> res.render possui capacidade de mandar objetos especifacmente para arquivos .ejs usarem, a função olha especifacmente se há o arquivo
especificado no diretório "views", então a localização do arquivo "main.js" e agora "connect.js" não pode ser mudado
-> Não testei o arquivo connect.mjs porque não quis baixar mySQL


Justificativa de mudanças:

- Foi feito o arquivo main.js para separar as funções de cada arquivo, assim, se houver algum bug, podemos separar adequadamente, 
esse arquivo em especifico cuidará somente da renderização da página principal e da API de Gemini

- A mudança da localização do arquivo "connect.mjs" foi feita para deixar os arquivos ".js" que incluem o packote "express" serem homegênios em questão de 
localização, tentei concertar o máximo possível





