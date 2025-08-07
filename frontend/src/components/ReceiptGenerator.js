import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class ReceiptGenerator {
  constructor(language, t) {
    this.language = language;
    this.t = t;
  }

  // Available options with pricing
  getAvailableOptions() {
    return [
      { id: 'insurance', name: 'Assurance Premium', price: 45 },
      { id: 'driver', name: 'Chauffeur Professionnel', price: 120 },
      { id: 'gps', name: 'Navigation GPS', price: 15 },
      { id: 'wifi', name: 'Hotspot Wi-Fi Mobile', price: 20 },
      { id: 'child_seat', name: 'Siège Enfant', price: 25 },
      { id: 'additional_driver', name: 'Conducteur Supplémentaire', price: 30 }
    ];
  }

  // Format date helper
  formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  // Create receipt HTML content
  createReceiptHTML(bookingData, bookingId) {
    const { bookingDetails, carDetails } = bookingData;
    const availableOptions = this.getAvailableOptions();
    
    // Store local copies to avoid reference issues
    const carName = carDetails?.name || 'Véhicule';
    const carCategory = carDetails?.category || 'Premium';
    const carPrice = carDetails?.price || 0;
    const startDateFormatted = this.formatDate(bookingDetails?.startDate);
    const endDateFormatted = this.formatDate(bookingDetails?.endDate);
    const totalDays = bookingDetails?.totalDays || 1;
    const totalPrice = bookingDetails?.totalPrice || 0;
    const pickupLocation = bookingDetails?.pickupLocation?.charAt(0).toUpperCase() + (bookingDetails?.pickupLocation?.slice(1) || '');
    const dropoffLocation = bookingDetails?.dropoffLocation?.charAt(0).toUpperCase() + (bookingDetails?.dropoffLocation?.slice(1) || '');
    const hasOptions = bookingDetails?.options && bookingDetails.options.length > 0;
    const optionsPrice = hasOptions ? totalPrice - (carPrice * totalDays) : 0;
    
    // Determine which options have been selected
    const selectedOptions = bookingDetails?.options?.map(optionId => {
      return availableOptions.find(opt => opt.id === optionId);
    }).filter(Boolean) || [];

    return `
      <div style="border: 1px solid #0e7490; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(8, 145, 178, 0.2); max-width: 100%; margin: 0 auto; background-color: #0f172a;">
        <!-- Header -->
        <div style="background: linear-gradient(to right, #0e7490, #1e40af); color: white; padding: 15px; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg=='); opacity: 0.2;"></div>
          
          <!-- Logo and info to the left -->
          <div style="position: relative; z-index: 1;">
            <h1 style="font-size: 24px; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: white; text-shadow: 0 0 5px rgba(34, 211, 238, 0.7);">RENT MY RIDE</h1>
            <p style="margin: 2px 0 0; font-size: 14px; opacity: 0.9;">${this.language === 'fr' ? 'Location de Voitures Premium' : 'Premium Car Rental'}</p>
          </div>
          
          <!-- Contact info to the right -->
          <div style="text-align: right; font-size: 12px; position: relative; z-index: 1;">
            <p style="margin: 0; opacity: 0.8;">www.rentmyride-morocco.ma</p>
            <p style="margin: 0; opacity: 0.8;">info@rentmyride-morocco.ma</p>
            <p style="margin: 0; opacity: 0.8;">+212 57 77 777</p>
          </div>
        </div>
        
        <!-- Receipt title -->
        <div style="background-color: #1e293b; padding: 10px; border-bottom: 1px solid #334155; text-align: center;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #22d3ee; text-shadow: 0 0 8px rgba(34, 211, 238, 0.5);">${this.language === 'fr' ? 'CONFIRMATION DE RÉSERVATION' : 'BOOKING CONFIRMATION'}</h2>
        </div>
        
        <!-- Reservation information -->
        <div style="padding: 15px; background: #0f172a;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${this.language === 'fr' ? 'Numéro de réservation' : 'Booking Number'}</p>
              <p style="margin: 0; color: #22d3ee; font-size: 14px; font-weight: 600;">#${bookingId}</p>
            </div>
            <div>
              <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${this.language === 'fr' ? 'Date d\'émission' : 'Issue Date'}</p>
              <p style="margin: 0; color: #f8fafc; font-size: 14px;">${new Date().toLocaleDateString(this.language === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
          
          <!-- Vehicle details -->
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
            <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${this.language === 'fr' ? 'Détails du Véhicule' : 'Vehicle Details'}</h3>
            <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px; display: flex; align-items: center;">
              <div style="font-size: 20px; color: #22d3ee; margin-right: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #22d3ee;">
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                  <circle cx="6.5" cy="16.5" r="2.5"/>
                  <circle cx="16.5" cy="16.5" r="2.5"/>
                  <path d="M5 11l1.5-3h9l1 3"/>
                  <path d="M7 10.7v-.8a.9.9 0 0 1 .9-.9h.8a.9.9 0 0 1 .9.9v.8a.9.9 0 0 1-.9.9h-.8a.9.9 0 0 1-.9-.9Z"/>
                  <path d="M14 10.7v-.8a.9.9 0 0 1 .9-.9h.8a.9.9 0 0 1 .9.9v.8a.9.9 0 0 1-.9.9h-.8a.9.9 0 0 1-.9-.9Z"/>
                  <path d="M2 12h4"/>
                  <path d="M18 12h4"/>
                </svg>
              </div>
              <div>
                <p style="margin: 0 0 3px; color: #f8fafc; font-size: 16px; font-weight: 600;">${carName}</p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">${carCategory}</p>
              </div>
            </div>
          </div>
          
          <!-- Rental details -->
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
            <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${this.language === 'fr' ? 'Détails de la Location' : 'Rental Details'}</h3>
            
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <div style="flex: 1; min-width: 45%;">
                <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                  <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${this.language === 'fr' ? 'Période de Location' : 'Rental Period'}</p>
                  <p style="margin: 0 0 5px; color: #f8fafc; font-size: 14px; font-weight: 600;">
                    ${startDateFormatted} → ${endDateFormatted}
                  </p>
                  <p style="margin: 0; padding: 3px 6px; background-color: #0c4a6e; color: #67e8f9; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-height: 24px; font-size: 12px; text-align: center;">
                    ${totalDays} ${this.language === 'fr' ? 'jours' : 'days'}
                  </p>
                </div>
              </div>
              
              <div style="flex: 1; min-width: 45%;">
                <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                  <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${this.language === 'fr' ? 'Lieux' : 'Locations'}</p>
                  <p style="margin: 0 0 3px; color: #f8fafc; font-size: 14px;">
                    <span style="font-weight: 600;">${this.language === 'fr' ? 'Départ' : 'Pickup'}:</span> ${pickupLocation}
                  </p>
                  <p style="margin: 0; color: #f8fafc; font-size: 14px;">
                    <span style="font-weight: 600;">${this.language === 'fr' ? 'Retour' : 'Return'}:</span> ${dropoffLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Selected options -->
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
            <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${this.language === 'fr' ? 'Options Sélectionnées' : 'Selected Options'}</h3>
            
            ${selectedOptions.length > 0 
              ? `<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background-color: #1e293b;">
                      <th style="text-align: left; padding: 8px; border-bottom: 1px solid #334155; font-weight: 600; color: #cbd5e1;">${this.language === 'fr' ? 'Description' : 'Description'}</th>
                      <th style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; font-weight: 600; color: #cbd5e1;">${this.language === 'fr' ? 'Prix' : 'Price'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${selectedOptions.map(option => `
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">${this.language === 'fr' ? option.name : option.id ? this.t('option_' + option.id) : option.name}</td>
                        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #22d3ee;">$${option.price}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>`
              : `<div style="text-align: center; padding: 12px; background-color: #1e293b; border: 1px dashed #334155; border-radius: 8px; color: #94a3b8; font-size: 13px;">
                  ${this.language === 'fr' ? 'Aucune option sélectionnée' : 'No options selected'}
                </div>`
            }
          </div>
          
          <!-- Payment summary -->
          <div>
            <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${this.language === 'fr' ? 'Résumé du Paiement' : 'Payment Summary'}</h3>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tbody>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #334155; color: #cbd5e1;">${this.language === 'fr' ? 'Location du véhicule' : 'Vehicle Rental'}</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">$${carPrice} × ${totalDays} ${this.language === 'fr' ? 'jours' : 'days'}</td>
                </tr>
                
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #334155; color: #cbd5e1;">${this.language === 'fr' ? 'Sous-total' : 'Subtotal'}</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">$${carPrice * totalDays}</td>
                </tr>
                
                ${hasOptions ? `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #334155; color: #cbd5e1;">${this.language === 'fr' ? 'Options additionnelles' : 'Additional Options'}</td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">$${optionsPrice}</td>
                  </tr>
                ` : ''}
                
                <tr style="background-color: #0f172a;">
                  <td style="padding: 10px 8px; font-weight: 600; color: #f8fafc; font-size: 15px;">${this.language === 'fr' ? 'Total' : 'Total'}</td>
                  <td style="text-align: right; padding: 10px 8px; font-weight: 700; font-size: 15px; color: #22d3ee;">$${totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 12px; background-color: #1e293b; text-align: center; border-top: 1px solid #334155; font-size: 12px;">
          <p style="margin: 0 0 5px; color: #cbd5e1;">${this.language === 'fr' ? 'Merci d\'avoir choisi Rent My Ride pour votre location de véhicule.' : 'Thank you for choosing Rent My Ride for your vehicle rental.'}</p>
          <p style="margin: 0; color: #94a3b8;">© ${new Date().getFullYear()} Rent My Ride. ${this.language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
        </div>
      </div>
    `;
  }

  // Add required styles to document
  addStylesToDocument() {
    const existingStyle = document.getElementById('receipt-styles');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'receipt-styles';
      style.textContent = `
        @page {
          margin: 0;
          padding: 0;
          background-color: black;
        }
        body {
          background-color: black;
          margin: 0;
          padding: 0;
        }
        #pdf-content {
          background-color: black;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      `;
      document.head.appendChild(style);
    }

    const existingFont = document.getElementById('orbitron-font');
    if (!existingFont) {
      const orbitronFont = document.createElement('link');
      orbitronFont.id = 'orbitron-font';
      orbitronFont.rel = 'stylesheet';
      orbitronFont.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap';
      document.head.appendChild(orbitronFont);
    }

    return document.getElementById('orbitron-font');
  }

  // Show notification
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.fontFamily = '"Orbitron", sans-serif';
    notification.style.fontWeight = '500';
    notification.textContent = message;

    // Set colors based on type
    switch (type) {
      case 'success':
        notification.style.background = 'linear-gradient(to right, white, #22d3ee)';
        notification.style.color = 'black';
        notification.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.3)';
        break;
      case 'error':
        notification.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        break;
      default:
        notification.style.background = 'linear-gradient(to right, white, #22d3ee)';
        notification.style.color = 'black';
        notification.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.3)';
    }

    document.body.appendChild(notification);

    // Remove notification after duration
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, duration);

    return notification;
  }

  // Clean up PDF generation elements
  cleanupPDFElements(receiptContent, loadingNotification, fontElement = null) {
    // Remove PDF content element
    if (receiptContent && document.body.contains(receiptContent)) {
      document.body.removeChild(receiptContent);
    }
    
    // Remove loading notification
    if (loadingNotification && document.body.contains(loadingNotification)) {
      document.body.removeChild(loadingNotification);
    }
    
    // Remove temporary font element if added
    if (fontElement && document.head.contains(fontElement) && fontElement.id !== 'orbitron-font') {
      document.head.removeChild(fontElement);
    }

    // Clean up any background containers
    const backgroundContainers = document.querySelectorAll('[data-pdf-background]');
    backgroundContainers.forEach(container => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    });
  }

  // Generate and download PDF receipt
  async generateReceipt(bookingData, bookingId, onSuccess, onError) {
    try {
      const pdfBookingId = bookingId || 'TEMP-' + Math.floor(Math.random() * 10000);
      
      // Show loading notification
      const loadingNotification = this.showNotification(this.t('receiptPreparation'), 'info', 10000);
      
      // Add styles to document
      const fontElement = this.addStylesToDocument();
      
      // Create receipt content element
      const receiptContent = document.createElement('div');
      receiptContent.id = 'pdf-content';
      receiptContent.style.width = '210mm';
      receiptContent.style.padding = '0';
      receiptContent.style.backgroundColor = 'black';
      receiptContent.style.color = 'white';
      receiptContent.style.fontFamily = '"Orbitron", sans-serif';
      receiptContent.style.position = 'fixed';
      receiptContent.style.top = '0';
      receiptContent.style.left = '0';
      receiptContent.style.zIndex = '-9999';
      receiptContent.style.margin = '0';
      receiptContent.style.boxSizing = 'border-box';
      receiptContent.style.overflow = 'hidden';
      
      // Set the receipt HTML content
      receiptContent.innerHTML = this.createReceiptHTML(bookingData, pdfBookingId);
      
      // Add to document
      document.body.appendChild(receiptContent);
      
      // Delay for content rendering
      setTimeout(() => {
        // Create background container
        const containerBackground = document.createElement('div');
        containerBackground.setAttribute('data-pdf-background', 'true');
        containerBackground.style.position = 'fixed';
        containerBackground.style.top = '0';
        containerBackground.style.left = '0';
        containerBackground.style.width = '100%';
        containerBackground.style.height = '100%';
        containerBackground.style.backgroundColor = 'black';
        containerBackground.style.zIndex = '-10000';
        document.body.appendChild(containerBackground);
        
        // Generate canvas and PDF
        html2canvas(receiptContent, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#000000',
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
          x: 0,
          y: 0
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
            background: 'black'
          });
          
          // Set black background
          pdf.setFillColor(0, 0, 0);
          pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
          
          // Calculate image dimensions
          const pageWidth = pdf.internal.pageSize.getWidth();
          const contentRatio = canvas.height / canvas.width;
          const imgWidth = pageWidth;
          const imgHeight = imgWidth * contentRatio;
          
          // Add image to PDF
          pdf.addImage(imgData, 'JPEG', 0, 6, imgWidth, imgHeight);
          
          // Save the PDF
          pdf.save(`recu-reservation-${pdfBookingId}.pdf`);
          
          // Clean up and call success callback
          this.cleanupPDFElements(receiptContent, loadingNotification, fontElement);
          
          if (onSuccess) {
            onSuccess(pdfBookingId);
          }
          
        }).catch(error => {
          console.error('Error generating canvas:', error);
          this.handleError(receiptContent, loadingNotification, fontElement, onError);
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error preparing PDF:', error);
      this.handleError(null, null, null, onError);
    }
  }

  // Handle errors during PDF generation
  handleError(receiptContent, loadingNotification, fontElement, onError) {
    // Clean up elements
    this.cleanupPDFElements(receiptContent, loadingNotification, fontElement);
    
    // Show error notification
    this.showNotification(this.t('receiptError'), 'error', 3000);
    
    // Call error callback if provided
    if (onError) {
      onError();
    }
  }
}

export default ReceiptGenerator;