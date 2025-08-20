import { NextRequest, NextResponse } from 'next/server';

// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = '8408169577:AAH_Iw2P1tzdIR5RDiJOnrsL0aOvKVbsKUs';
const TELEGRAM_CHAT_ID = '5460685855';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

interface OrderData {
  fullName: string;
  phoneNumber: string;
  address: string;
  shippingMethod: 'pickup' | 'delivery';
  selectedProducts: Array<{
    id: number;
    quantity: number;
  }>;
  selectedProductsWithDetails: Array<{
    id: number;
    name: string;
    description: string;
    image: string;
    color: string;
    quantity: number;
    price?: number;
  }>;
}

function formatOrderMessage(orderData: OrderData): string {
  const { fullName, phoneNumber, address, shippingMethod, selectedProductsWithDetails } = orderData;

  // Calculate total items and total price
  const totalItems = selectedProductsWithDetails.reduce((sum, product) => sum + product.quantity, 0);
  const totalPrice = selectedProductsWithDetails.reduce((sum, product) => {
    return sum + ((product.price || 0) * product.quantity);
  }, 0);

  // Format products list with prices
  const productsList = selectedProductsWithDetails
    .map(product => {
      const itemTotal = (product.price || 0) * product.quantity;
      return `• <b>${product.name}</b> (Qty: ${product.quantity}) - ${itemTotal} DZD`;
    })
    .join('\n');

  // Create formatted message with HTML formatting
  const message = `🛒 <b>NEW ORDER RECEIVED</b>

👤 <b>Customer Details:</b>
<b>Name:</b> ${fullName}
<b>Phone:</b> ${phoneNumber}
<b>Address:</b> ${address}

📦 <b>Shipping Method:</b> ${shippingMethod === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}

🍰 <b>Products Ordered (${totalItems} items):</b>
${productsList}

💰 <b>Total Price:</b> ${totalPrice} DZD

📅 <b>Order Time:</b> ${new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })} UTC

<i>Order submitted via website form</i>`;

  return message;
}

// GET method for testing the API endpoint
export async function GET() {
  return NextResponse.json(
    {
      message: 'Order submission API is working',
      endpoint: '/api/submit-order',
      method: 'POST',
      telegramConfigured: !!TELEGRAM_BOT_TOKEN && !!TELEGRAM_CHAT_ID
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const orderData: OrderData = await request.json();

    // Validate required fields
    if (!orderData.fullName || !orderData.phoneNumber || !orderData.address || !orderData.selectedProductsWithDetails?.length) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      );
    }

    // Additional validation
    if (!orderData.shippingMethod || !['pickup', 'delivery'].includes(orderData.shippingMethod)) {
      return NextResponse.json(
        { error: 'Invalid shipping method' },
        { status: 400 }
      );
    }



    // Format the message for Telegram
    const message = formatOrderMessage(orderData);

    // Send message to Telegram
    const telegramResponse = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API error:', errorData);
      throw new Error(`Telegram API error: ${errorData.description || 'Unknown error'}`);
    }

    const telegramData = await telegramResponse.json();
    console.log('Order sent to Telegram successfully:', telegramData);

    return NextResponse.json(
      {
        success: true,
        message: 'Order submitted successfully',
        telegramMessageId: telegramData.result?.message_id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing order:', error);

    return NextResponse.json(
      {
        error: 'Failed to process order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
