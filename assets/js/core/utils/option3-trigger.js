 <!-- dashboard.html snippet -->
<label for="paymentOption">Choose Payment Option:</label>
<select id="paymentOption">
    <option value="OPTION_1">Option 1</option>
    <option value="OPTION_2">Option 2</option>
    <option value="OPTION_3">Option 3</option>
</select>

<button id="payBtn">Pay Now</button>

<script type="module">
import { runOption1Payment } from './utils/option1-trigger.js';
import { runOption2Payment } from './utils/option2-trigger.js';
import { runOption3Payment } from './utils/option3-trigger.js';

// Example user and payment data (replace with real dashboard values)
const currentUser = { id: 'USER123' };
const paymentData = { amount: 2000, method: 'CARD' };

const paymentSelect = document.getElementById('paymentOption');
const payBtn = document.getElementById('payBtn');

payBtn.addEventListener('click', async () => {
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    const selectedOption = paymentSelect.value;
    let result;

    try {
        switch (selectedOption) {
            case 'OPTION_1':
                result = await runOption1Payment(currentUser, paymentData);
                break;
            case 'OPTION_2':
                result = await runOption2Payment(currentUser, paymentData);
                break;
            case 'OPTION_3':
                result = await runOption3Payment(currentUser, paymentData);
                break;
            default:
                throw new Error('Invalid payment option selected');
        }

        if (result.status === 'SUCCESS') {
            alert(`Payment successful via ${selectedOption}!`);
        } else {
            alert(`Payment failed via ${selectedOption}: ${result.error?.message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error('[Dashboard] Payment error:', err);
        alert('Unexpected error occurred during payment.');
    } finally {
        payBtn.disabled = false;
        payBtn.textContent = 'Pay Now';
    }
});
</script>
