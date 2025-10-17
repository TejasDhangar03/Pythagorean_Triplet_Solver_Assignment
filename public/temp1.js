document.addEventListener('DOMContentLoaded', () => {
    const elAB = document.querySelector('.editable-ab');
    const elBC = document.querySelector('.editable-bc');
    const elAC = document.querySelector('.editable-ac');

    const acNumEls = document.querySelectorAll('.ac-num');
    const bcNumEls = document.querySelectorAll('.bc-num, .bc-num2');
    const abNumEls = document.querySelectorAll('.ab-num');
    const pythStepEl = document.querySelector('.pyth-step');
    const tripletTextEl = document.querySelector('.triplet-text');
    const resultBox = document.querySelector('.result-box');

    function parseNumberFromText(text) {
        const m = text.trim().match(/-?\d+(\.\d+)?/);
        return m ? parseFloat(m[0]) : NaN;
    }

    async function updateAllFromInputs() {
        const ab = parseNumberFromText(elAB.textContent);
        const bc = parseNumberFromText(elBC.textContent);
        const ac = parseNumberFromText(elAC.textContent);

        if (!isNaN(ac)) acNumEls.forEach(e => e.textContent = ac);
        if (!isNaN(bc)) bcNumEls.forEach(e => e.textContent = bc);
        if (!isNaN(ab)) abNumEls.forEach(e => e.textContent = ab);

        // Dynamic Pythagorean step
        if (!isNaN(ab) && !isNaN(bc) && !isNaN(ac)) {
            const diff = ac - bc;
            pythStepEl.innerHTML = `
                <span class="ac-val">${ac}</span> - <span class="bc-val">${bc}</span> = ${diff} &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="ac-val2">${ac}</span>² - <span class="bc-val2">${bc}</span>² = <span class="ab-val">${ab}</span>²
            `;
        } else {
            pythStepEl.textContent = 'Values incomplete or invalid';
        }

        try {
            const response = await fetch('/calculate-triangle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ab, bc, ac })
            });
            const data = await response.json();

            if (data.result !== undefined) resultBox.textContent = data.result;
            if (data.isTriplet !== undefined) {
                tripletTextEl.textContent = data.isTriplet
                    ? `${ab}, ${bc}, ${ac} is a Pythagorean triplet`
                    : `${ab}, ${bc}, ${ac} is Not a Pythagorean triplet`;
            }

        } catch (err) {
            console.error(err);
            tripletTextEl.textContent = 'Calculation error';
            resultBox.textContent = '';
        }
    }

    // Make inputs editable & attach listeners
    [elAB, elBC, elAC].forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.style.outline = 'none';
        el.addEventListener('input', updateAllFromInputs);
        el.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const n = parseFloat((text.match(/-?\d+(\.\d+)?/) || [''])[0]);
            if (!isNaN(n)) document.execCommand('insertText', false, n + ' cm');
            updateAllFromInputs();
        });
    });

    updateAllFromInputs();
});
