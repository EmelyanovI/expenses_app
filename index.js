//Объявление переменных - Строковых констант
const STATUS_IN_LIMIT = 'Всё хорошо';
const STATUS_OUT_IN_LIMIT = 'Лимит превышен!';
const CHANGE_LIMIT_TEXT = 'Новый лимит';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';

//Объвление переменных - ссылок на HTML элементы
const inputNode = document.getElementById('expenseInput');
const categorySelectNode = document.getElementById('categorySelect')
const addButtonNode = document.getElementById('addButton');
const clearButtonNode = document.getElementById('clearButton');
const totalValueNode = document.getElementById('totalValue');
const statusNode = document.getElementById('statusText');
const historyList = document.getElementById('historyList')
const changeLimitBtn = document.getElementById('popupLimitBtn');

//Получаем лимит из элемента HTML с id limitValue
const limitNode = document.getElementById('limitValue');
let limit = parseInt(limitNode.innerText);

function initLimit() {
    const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
    if (!isNaN(limitFromStorage)) {
    limitNode.innerText = limitFromStorage;
    limit = limitFromStorage
    } else {
        limitNode.innerText = '10000';
        limit = 10000;
        localStorage.setItem(STATUS_OUT_IN_LIMIT, limit);
    }
};

initLimit();

//Объявление нашей основной переменной
//При запуске она содержит в себе пустой массив
//который мы пополняем по нажатию на кнопку Добавить
const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];
if (Array.isArray(expensesFromStorage)) {
    expenses = expensesFromStorage;
}
render();

//---------Функции-------

//подсчитываем и возвращаем сумму всех трат
function getTotal() {
    let sum = 0;
    expenses.forEach((expense) => {
        //пробегаем по массиву объектов expense, берем из каждого поле amount
        //и прибавляем к переменной sum
        sum += expense.amout;
    });

    return sum;
}

//Отрисовываем/обновляем блок с "Всего", "Лимит" и "Статус"
function renserStatus() {
    //создаем переменную total(всего) и записываем в неё 
    //результат выполнения getTotal
    const total = getTotal(expenses);
    totalValueNode.innerText = total;

    //условия сравнения - что больше "Всего" или "Лимит"
    if (total <= limit) {
        //"Всего" меньше чем "Лимит" - все хорошо
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.className = 'stats__statusText_positive';
    } else {
        //"Всего" больше чем "Лимит" - все плохо

        //шаблонная строка - строка в которую можно вставить переменные
        //тут вставлена переменная STATUS_UOT_IN_LIMIT
        //и будет вставлено значение разницы между лимитом и общей суммой расходов
        statusNode.innerText = `${STATUS_OUT_IN_LIMIT} (${limit - total} руб)`;
        statusNode.className = 'stats__statusText_negative';
    }
}

// Отрисовываем/обновляем блок
function renderHistory() {
    historyList.innerHTML = '';
    expenses.forEach((expense) => {
        //создаем элемент li (он пока создан только в памяти)
        const historyItem = document.createElement('li');

        //через свойство className так же можно прописывать классы
        historyItem.className = 'rub';

        //снова создаем шаблонную строку
        //фомата "Категория" - "Сумма" (а не наоборот, чтобы не усложнять html)
        historyItem.innerText = `${expense.category} - ${expense.amout}`;

        //берем наш li из памяти и всавляем в документ, в конце historyList
        historyList.appendChild(historyItem);
    });
}

//Отрисовываем/обновляем весь интерфейс (в нашем случае - "Историю","Всего", "Статус")
function render() {
    //вызываем функцию обновления статуса и всего
    renserStatus();

    //вызываем функцию обновления истории
    renderHistory();
};

//Возыращаем введенную пользователем сумму
function getExpenseFromUser() {
    return parseInt(inputNode.value);
}

//Возвращаем введенную пользователем категорию
function getSelectedCategory() {
    return categorySelectNode.value;
};

//функция очистки поля ввода суммы
//на вход получает переменную input, в которой мы ожидаем html элемент input

function clearInput(input) {
    input.value = '';
}

function saveExpensesToStorage() {
    const expensesString = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}

//функция-обработчик которая будет вызвана при нажатии на кнопку Добавить
function addButtonHandler() {
    //сохраняем в переменную currentAmout(текущаяСумма) введенную сумму
    const currentAmout = getExpenseFromUser();
    if (!currentAmout) {
        alert('Не задана сумма');
        return;
    }

    //Сохраняем в переменную currentCategory(текущаяКатегория) выбранную категорию
    const currentCategory = getSelectedCategory();
    //если текущаяКатегория равна значению Категория
    if (currentCategory === 'Категория') {
        //тогда выйди из функции, т.к. это хначение говорит нам о том
        //что пользователь не выбрал категорию
        alert('Не задана категория');
        return;
    }

    //из полученных переменных собираем объект newExpense(новыйРасход)
    //который состоит из двух полей - amout, в которое записано значение currentAmout
    //и category, в которое записано значение currentCategory
    const newExpense = { amout: currentAmout, category: currentCategory };
    console.log(newExpense);

    //Добвыляем наш новыйРасход в массив расходов
    expenses.push(newExpense);
    saveExpensesToStorage();

    //перерисовываем интерфейс
    render();

    //сбрасываем веденную сумму
    clearInput(inputNode);
};

//функция-обработчик кнопки Сбросить расходы
function clearButtonHandler() {
    expenses = [];
    render();
    localStorage.clear();
}
//фунция-обработчик (хендлер) кнопки изменения лимита
function changeLimitHandler() {
    //в переменную newLimit мы записываем результат выполнения функции prompt
    //в которой передаем параметр "новыйЛимит"
    //prompt вызывает встроеннную в браузер модалку с инпутом
    //а возвращает то что ввел в инпут пользователь
    const newLimit = prompt(CHANGE_LIMIT_TEXT);

    //потому что там может быть строка
    const newLimitValue = parseInt(newLimit);

    if (!newLimitValue) {
        return;
    };

    //прописываем в html номое значение лимита
    limitNode.innerText = newLimitValue;
    //а также прописываем это значение в нашу переменную с лимитом
    limit = newLimitValue;
    localStorage.setItem(STORAGE_LABEL_LIMIT, newLimitValue);

    //обновляем интерфейс
    render();
};

//Привязка функции-обработчика к кнопкам
addButtonNode.addEventListener('click', addButtonHandler);
clearButtonNode.addEventListener('click', clearButtonHandler);
changeLimitBtn.addEventListener('click', changeLimitHandler);
