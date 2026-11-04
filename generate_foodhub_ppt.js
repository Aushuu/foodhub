import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'FoodHub Project';
pptx.company = 'College Project';
pptx.subject = 'Online Food Ordering and Management System';
pptx.title = 'FoodHub – Online Food Ordering and Management System';
pptx.theme = {
  colorScheme: {
    name: 'FoodHub',
    data: {
      accent1: 'F97316',
      accent2: '0F172A',
      accent3: '14B8A6',
      accent4: 'F59E0B',
      accent5: 'E2E8F0',
      accent6: '475569',
      hlink: '2563EB',
      folHlink: '1D4ED8',
      bg1: 'F8FAFC',
      bg2: 'FFFFFF'
    }
  }
};

function addFooter(slide, pageNum) {
  slide.addText(`Slide ${pageNum}`, {
    x: 11.7, y: 7.08, w: 1.0, h: 0.25,
    fontFace: 'Aptos', fontSize: 10, color: '64748B', align: 'right'
  });
}

function addTitle(slide, title) {
  slide.addText(title, {
    x: 0.55, y: 0.35, w: 7.5, h: 0.5,
    fontFace: 'Aptos', bold: true, fontSize: 26, color: '0F172A'
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.6, y: 0.95, w: 12.1, h: 0, line: { color: 'F97316', width: 2 }
  });
}

// Slide 1: Title Slide
let slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
slide.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: 13.33, h: 1.2, fill: { color: 'F97316' }, line: { color: 'F97316', width: 0 }
});
slide.addText('FoodHub', {
  x: 0.7, y: 0.25, w: 5, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 26, color: 'FFFFFF'
});
slide.addText('Online Food Ordering and Management System', {
  x: 0.75, y: 1.7, w: 8.8, h: 0.7,
  fontFace: 'Aptos', bold: true, fontSize: 28, color: '0F172A'
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 8.1, y: 1.3, w: 4.6, h: 4.3,
  fill: { color: '0F172A' }, line: { color: '0F172A', width: 0 }, radius: 0.12
});
slide.addText('Project Snapshot', {
  x: 8.5, y: 1.8, w: 3.8, h: 0.4,
  fontFace: 'Aptos', bold: true, fontSize: 16, color: 'FFFFFF', align: 'center'
});
slide.addText('• Customer-friendly\n• Fast ordering\n• Secure login\n• Admin management', {
  x: 8.6, y: 2.5, w: 3.3, h: 1.8,
  fontFace: 'Aptos', fontSize: 15, color: 'E2E8F0', bullet: { indent: 0.2 }, margin: 0.05
});
slide.addText('Student Name', {
  x: 0.75, y: 2.7, w: 5.8, h: 0.45,
  fontFace: 'Aptos', fontSize: 18, color: '334155', bold: true
});
slide.addText('Roll Number', {
  x: 0.75, y: 3.35, w: 5.8, h: 0.45,
  fontFace: 'Aptos', fontSize: 18, color: '334155', bold: true
});
slide.addText('Department', {
  x: 0.75, y: 4.0, w: 5.8, h: 0.45,
  fontFace: 'Aptos', fontSize: 18, color: '334155', bold: true
});
slide.addText('College Name', {
  x: 0.75, y: 4.65, w: 5.8, h: 0.45,
  fontFace: 'Aptos', fontSize: 18, color: '334155', bold: true
});
slide.addText('Academic Year', {
  x: 0.75, y: 5.3, w: 5.8, h: 0.45,
  fontFace: 'Aptos', fontSize: 18, color: '334155', bold: true
});
addFooter(slide, 1);

// Slide 2: Introduction
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Introduction');
slide.addText('FoodHub is a full-stack online food ordering platform that allows users to browse menus, search dishes, add items to cart, and place food orders through a simple web interface.', {
  x: 0.7, y: 1.5, w: 7.8, h: 1.2,
  fontFace: 'Aptos', fontSize: 20, color: '0F172A', margin: 0.1, breakLine: true
});
slide.addText('The system is designed to make food ordering faster, more convenient, and more organized for both customers and administrators.', {
  x: 0.7, y: 2.7, w: 7.8, h: 0.9,
  fontFace: 'Aptos', fontSize: 19, color: '334155', margin: 0.1, breakLine: true
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 8.8, y: 1.6, w: 3.8, h: 2.4,
  fill: { color: 'F97316' }, line: { color: 'F97316', width: 0 }, radius: 0.2
});
slide.addText('How it works', {
  x: 9.05, y: 1.9, w: 3.25, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 18, color: 'FFFFFF', align: 'center'
});
slide.addText('1. Browse food items\n2. Search by category\n3. Add to cart\n4. Place order\n5. Track delivery status', {
  x: 9.1, y: 2.7, w: 3.1, h: 2.0,
  fontFace: 'Aptos', fontSize: 16, color: 'FFFFFF', bullet: { indent: 0.15 }, margin: 0.12
});
slide.addText('Purpose: to reduce waiting time, improve user experience, and automate food order management.', {
  x: 0.7, y: 5.2, w: 11.7, h: 0.8,
  fontFace: 'Aptos', fontSize: 19, color: '0F172A', italic: true, margin: 0.1
});
addFooter(slide, 2);

// Slide 3: Problem Statement
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Problem Statement');
const problemBullets = '• Traditional food ordering often involves long queues, delays, and manual communication with staff.\n• Customers struggle to view menus quickly, compare dishes, and place orders without visiting the restaurant.\n• Restaurants need a digital system to manage orders, reduce errors, and process food requests efficiently.';
slide.addText(problemBullets, {
  x: 0.8, y: 1.6, w: 7.8, h: 3.5,
  fontFace: 'Aptos', fontSize: 21, color: '0F172A', bullet: { indent: 0.2 }, margin: 0.15
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 9.2, y: 1.8, w: 2.9, h: 2.5,
  fill: { color: '0F172A' }, line: { color: '0F172A', width: 0 }, radius: 0.18
});
slide.addText('Need for Online System', {
  x: 9.35, y: 2.2, w: 2.5, h: 0.7,
  fontFace: 'Aptos', bold: true, fontSize: 18, color: 'FFFFFF', align: 'center'
});
slide.addText('Faster service\nEasy access\nData driven management\nReduced human error', {
  x: 9.5, y: 3.2, w: 2.2, h: 1.5,
  fontFace: 'Aptos', fontSize: 15, color: 'E2E8F0', bullet: { indent: 0.1 }, margin: 0.1
});
addFooter(slide, 3);

// Slide 4: Project Objectives
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Project Objectives');
slide.addText('Main goals of FoodHub:', {
  x: 0.7, y: 1.3, w: 4.8, h: 0.4,
  fontFace: 'Aptos', bold: true, fontSize: 20, color: '0F172A'
});
slide.addText('• Provide an easy and user-friendly online food ordering experience for customers\n• Improve order management with a structured backend and database\n• Support search, category filters, and cart management\n• Enable secure login and authentication using JWT\n• Allow administrators to manage foods and monitor orders effectively', {
  x: 0.7, y: 1.8, w: 7.4, h: 3.3,
  fontFace: 'Aptos', fontSize: 20, color: '0F172A', bullet: { indent: 0.15 }, margin: 0.18
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 8.6, y: 1.6, w: 3.8, h: 3.4,
  fill: { color: '14B8A6' }, line: { color: '14B8A6', width: 0 }, radius: 0.2
});
slide.addText('Benefits', {
  x: 9.0, y: 2.0, w: 2.9, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 18, color: 'FFFFFF', align: 'center'
});
slide.addText('Convenient ordering\nBetter customer satisfaction\nImproved efficiency\nReduced manual work\nDigital food tracking', {
  x: 9.1, y: 2.9, w: 2.7, h: 2.0,
  fontFace: 'Aptos', fontSize: 16, color: 'FFFFFF', bullet: { indent: 0.12 }, margin: 0.12
});
addFooter(slide, 4);

// Slide 5: Technologies Used
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Technologies Used');
const techCards = [
  ['Frontend', 'HTML, CSS, JavaScript, React.js\nBuilds a responsive interface and interactive user experience.'],
  ['Backend', 'Node.js, Express.js\nHandles APIs, authentication, and business logic.'],
  ['Database', 'MongoDB Atlas\nStores users, food items, orders, and cart data.'],
  ['Authentication', 'JWT\nSecures user sessions and admin access.'],
  ['Development', 'VS Code\nUsed for coding, debugging, and project management.'],
  ['UI Styling', 'Tailwind CSS\nProvides modern and mobile-friendly design.']
];
const cardX = [0.7, 4.8, 8.9];
const cardY = [1.5, 1.5, 1.5, 4.0, 4.0, 4.0];
techCards.forEach((card, i) => {
  const x = cardX[i % 3];
  const y = cardY[i];
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.6, h: 1.8,
    fill: { color: i % 2 === 0 ? 'FFFFFF' : 'E2E8F0' }, line: { color: 'CBD5E1', width: 1 }, radius: 0.12
  });
  slide.addText(card[0], {
    x: x + 0.2, y: y + 0.15, w: 2.8, h: 0.35,
    fontFace: 'Aptos', bold: true, fontSize: 18, color: '0F172A'
  });
  slide.addText(card[1], {
    x: x + 0.2, y: y + 0.55, w: 3.0, h: 1.0,
    fontFace: 'Aptos', fontSize: 12.5, color: '475569', margin: 0.02, breakLine: true
  });
});
addFooter(slide, 5);

// Slide 6: System Modules
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'System Modules');
const modules = [
  ['User Authentication', 'Registration, login, secure session handling, JWT-based access control'],
  ['Food Menu', 'Browse dishes, menu categories, pricing information, and item details'],
  ['Search & Categories', 'Menu filter, quick search, veg/non-veg selection, sorting'],
  ['Shopping Cart', 'Add/remove items, quantity updates, subtotal and checkout summary'],
  ['Order Placement', 'Enter address, confirm order, and generate billing details'],
  ['Admin Management', 'Manage food items, view orders, and update order status']
];
modules.forEach((m, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  const x = 0.7 + col * 6.1;
  const y = 1.5 + row * 2.1;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 5.3, h: 1.5,
    fill: { color: 'FFFFFF' }, line: { color: 'F97316', width: 1.5 }, radius: 0.12
  });
  slide.addText(m[0], {
    x: x + 0.25, y: y + 0.15, w: 4.8, h: 0.4,
    fontFace: 'Aptos', bold: true, fontSize: 17, color: '0F172A'
  });
  slide.addText(m[1], {
    x: x + 0.25, y: y + 0.65, w: 4.6, h: 0.6,
    fontFace: 'Aptos', fontSize: 12.5, color: '475569', margin: 0.02
  });
});
addFooter(slide, 6);

// Slide 7: System Architecture and Workflow
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'System Architecture and Workflow');
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.7, w: 2.8, h: 1.7,
  fill: { color: 'F97316' }, line: { color: 'F97316', width: 0 }, radius: 0.15
});
slide.addText('React Frontend', {
  x: 1.05, y: 2.15, w: 2.3, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 18, color: 'FFFFFF', align: 'center'
});
slide.addText('User interface', {
  x: 1.05, y: 2.73, w: 2.3, h: 0.3,
  fontFace: 'Aptos', fontSize: 12, color: 'FFF7ED', align: 'center'
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 5.1, y: 1.7, w: 3.1, h: 1.7,
  fill: { color: '0F172A' }, line: { color: '0F172A', width: 0 }, radius: 0.15
});
slide.addText('Node.js / Express Backend', {
  x: 5.35, y: 2.0, w: 2.6, h: 0.8,
  fontFace: 'Aptos', bold: true, fontSize: 18, color: 'FFFFFF', align: 'center'
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 9.5, y: 1.7, w: 2.9, h: 1.7,
  fill: { color: '14B8A6' }, line: { color: '14B8A6', width: 0 }, radius: 0.15
});
slide.addText('MongoDB Atlas', {
  x: 9.75, y: 2.15, w: 2.4, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 18, color: 'FFFFFF', align: 'center'
});
slide.addText('Database storage', {
  x: 9.75, y: 2.73, w: 2.4, h: 0.3,
  fontFace: 'Aptos', fontSize: 12, color: 'ECFEFF', align: 'center'
});
slide.addText('→', {
  x: 3.8, y: 2.25, w: 1.1, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 30, color: 'F97316', align: 'center'
});
slide.addText('→', {
  x: 8.3, y: 2.25, w: 1.1, h: 0.5,
  fontFace: 'Aptos', bold: true, fontSize: 30, color: 'F97316', align: 'center'
});
slide.addText('Complete order workflow:\n1. User browses menu and searches food\n2. Adds dishes to cart and updates quantity\n3. Enters delivery details and confirms order\n4. Backend saves order in MongoDB\n5. Admin reviews and updates order status', {
  x: 0.8, y: 4.1, w: 11.6, h: 2.1,
  fontFace: 'Aptos', fontSize: 19, color: '0F172A', bullet: { indent: 0.2 }, margin: 0.15, breakLine: true
});
addFooter(slide, 7);

// Slide 8: Database Design
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Database Design');
const dbCards = [
  ['Users', 'Stores customer and admin credentials, profile details, role, and contact information'],
  ['FoodItems', 'Stores menu data such as name, category, price, description, image, and availability'],
  ['Orders', 'Records customer order details, status, totals, delivery info, and timestamps'],
  ['Cart', 'Stores selected food items, quantities, and temporary cart data before checkout']
];
const dbX = [0.8, 6.8, 0.8, 6.8];
const dbY = [1.6, 1.6, 4.1, 4.1];
dbCards.forEach((db, i) => {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: dbX[i], y: dbY[i], w: 5.3, h: 1.8,
    fill: { color: i % 2 === 0 ? 'FFFFFF' : 'E2E8F0' }, line: { color: '0F172A', width: 1.2 }, radius: 0.14
  });
  slide.addText(db[0], {
    x: dbX[i] + 0.2, y: dbY[i] + 0.2, w: 4.8, h: 0.35,
    fontFace: 'Aptos', bold: true, fontSize: 18, color: '0F172A'
  });
  slide.addText(db[1], {
    x: dbX[i] + 0.2, y: dbY[i] + 0.65, w: 4.8, h: 0.8,
    fontFace: 'Aptos', fontSize: 12.5, color: '475569', margin: 0.03
  });
});
slide.addText('MongoDB Atlas provides flexible document-based storage and easy retrieval of customer and order information.', {
  x: 0.8, y: 6.2, w: 11.8, h: 0.5,
  fontFace: 'Aptos', fontSize: 16, color: '0F172A', italic: true
});
addFooter(slide, 8);

// Slide 9: Implementation and Output Screenshots
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Implementation and Output Screenshots');
const placeholderPositions = [
  [0.7, 1.5, 3.7, 1.8],
  [4.7, 1.5, 3.7, 1.8],
  [8.7, 1.5, 3.7, 1.8],
  [0.7, 4.0, 3.7, 1.8],
  [4.7, 4.0, 3.7, 1.8],
  [8.7, 4.0, 3.7, 1.8]
];
const placeholderLabels = [
  'Homepage', 'Login', 'Food Menu', 'Cart', 'Order Confirmation', 'Admin Dashboard'
];
placeholderPositions.forEach(([x, y, w, h], idx) => {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: 'FFFFFF' }, line: { color: 'CBD5E1', width: 1.2 }, radius: 0.12
  });
  slide.addShape(pptx.ShapeType.line, {
    x: x + 0.2, y: y + 0.4, w: w - 0.4, h: 0,
    line: { color: 'F97316', width: 1 }
  });
  slide.addText(placeholderLabels[idx], {
    x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.2,
    fontFace: 'Aptos', bold: true, fontSize: 14, color: '0F172A', align: 'center'
  });
  slide.addText('Screenshot Placeholder', {
    x: x + 0.2, y: y + 0.7, w: w - 0.4, h: 0.6,
    fontFace: 'Aptos', fontSize: 12, color: '64748B', align: 'center'
  });
});
addFooter(slide, 9);

// Slide 10: Conclusion and Future Enhancements
slide = pptx.addSlide();
slide.background = { color: 'F8FAFC' };
addTitle(slide, 'Conclusion and Future Enhancements');
slide.addText('FoodHub successfully demonstrates how a web-based food ordering system can simplify customer access, improve ordering processes, and support digital management for restaurants. The project combines functionality, usability, and modern technology to meet real-world requirements.', {
  x: 0.8, y: 1.5, w: 7.8, h: 1.8,
  fontFace: 'Aptos', fontSize: 20, color: '0F172A', breakLine: true
});
slide.addText('Future enhancements include:', {
  x: 0.8, y: 3.5, w: 5.0, h: 0.4,
  fontFace: 'Aptos', bold: true, fontSize: 20, color: '0F172A'
});
slide.addText('• Online payment integration\n• Live order tracking\n• Customer ratings and reviews\n• Delivery partner management\n• Push notifications and loyalty rewards', {
  x: 0.8, y: 4.1, w: 6.3, h: 2.0,
  fontFace: 'Aptos', fontSize: 20, color: '0F172A', bullet: { indent: 0.2 }, margin: 0.12, breakLine: true
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 8.8, y: 1.8, w: 3.4, h: 3.8,
  fill: { color: 'F97316' }, line: { color: 'F97316', width: 0 }, radius: 0.2
});
slide.addText('Project Summary', {
  x: 9.1, y: 2.2, w: 2.8, h: 0.45,
  fontFace: 'Aptos', bold: true, fontSize: 17, color: 'FFFFFF', align: 'center'
});
slide.addText('User-friendly interface\nSecure apps\nScalable architecture\nEfficient order flow', {
  x: 9.25, y: 3.1, w: 2.5, h: 2.0,
  fontFace: 'Aptos', fontSize: 16, color: 'FFF7ED', bullet: { indent: 0.1 }, margin: 0.1
});
addFooter(slide, 10);

pptx.writeFile({ fileName: 'FoodHub_Project_Presentation.pptx' })
  .then(() => {
    console.log('PowerPoint created: FoodHub_Project_Presentation.pptx');
  })
  .catch((err) => {
    console.error('Error creating PowerPoint:', err);
    process.exit(1);
  });
