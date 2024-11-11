export let orderList = [];

function calculateTotalQuantity()
{
    let count = 0;
    orderList.forEach((order) =>
    {
        count += order.quantity;
    })

    return count;
}

// Adds to orderList.
export function addToOrderList(mealName, mealId) {
    let matchingItem;
    const totalQuantity = calculateTotalQuantity();

    if(totalQuantity == 11)
    {
        alert("Cannot add more! Maximum limit reached!");
        return;
    }

    orderList.forEach((orderedItem) => {
        if (mealId === orderedItem.mealId) {
            matchingItem = orderedItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        orderList.push({
            mealId: mealId,
            mealName: mealName,
            quantity: 1
        });
    }
}

