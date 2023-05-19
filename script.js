console.warn = function() {};


const API_KEY = 'AIzaSyCOK-onXute465367hjsJVC6_YWdtlmdBo';
const CLIENT_ID = '752430066929-va9g3iodftb1p08o9madajikpl139fti.apps.googleusercontent.com';
const SPREADSHEET_ID = '1TnqpiqAnd_JbYrRcx_Y3uydVHJ-KvjmMbutOScT2Hkg';
const COLUMN_NAME = 'AutoINSP - InputText';

gapi.load('client', init);

function init() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  }).then(() => {
    console.log('API do Google Sheets inicializada');

    const form = document.getElementById('form');
    form.addEventListener('submit', submitForm);

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', searchRow);
  });
}

function submitForm(event) {
  event.preventDefault();

  const inputText = document.getElementById('inputText').value;

  const values = [
    [inputText]
  ];

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: COLUMN_NAME,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
    
  }).then((response) => {
    console.log('Resposta da API do Google Sheets:', response);
    console.log('Dados enviados com sucesso:', response);
    document.getElementById('inputText').value = '';

  }).catch((error) => {
    console.error('Erro ao enviar dados:', error);
   
  });
}

function searchRow(event) {
  event.preventDefault();

  const rowNumber = document.getElementById('rowNumber').value;

  gapi.client.sheets.spreadsheets
  .values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${COLUMN_NAME}!A${rowNumber}`
  }).then((response) => {
    const value = response.result.values[0][0];
    document.getElementById('searchResult').innerText = `Valor na linha ${rowNumber}: ${value}`;
    document.getElementById('rowNumber').value = '';

  }).catch((error) => {
    console.error('Erro ao pesquisar linha:', error);
    rowNumber.innerHTML = `
        <h2>Ocorreu um erro na digitação do nome ou do id.</h2>
       
      `;
  });
}