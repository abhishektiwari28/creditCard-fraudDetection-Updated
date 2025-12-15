import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fpdf import FPDF
import os
from datetime import datetime

# Email Configuration
# In a real scenario, these would be in environment variables
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your_email@gmail.com" # Placeholder
SENDER_PASSWORD = "your_app_password" # Placeholder

def send_fraud_alert_email(to_email, transaction_details):
    """
    Sends an email alert for high-risk transactions.
    """
    try:
        # Check if meant to be simulated
        if SENDER_EMAIL == "your_email@gmail.com":
            print(f"SIMULATION: Sending email to {to_email} about fraud: {transaction_details}")
            return True

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = f"URGENT: Fraud Detected - Transaction {transaction_details.get('id', 'N/A')}"

        body = f"""
        Dear User,

        A high-risk transaction has been detected on your card.
        
        Details:
        - Date: {transaction_details.get('trans_date_trans_time')}
        - Merchant: {transaction_details.get('merchant')}
        - Amount: ${transaction_details.get('amt')}
        - Risk Score: {transaction_details.get('risk_score', 0) * 100:.2f}%
        
        Action Taken: CARD BLOCKED TEMPORARILY.
        
        Please contact support if this was you.
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Fraud Detection Report', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_fraud_report(transaction_details):
    """
    Generates a PDF report for a specific transaction.
    """
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Title Info
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, f"Transaction Report ID: {transaction_details.get('id', 'N/A')}", 0, 1)
    pdf.cell(0, 10, f"Date Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 1)
    pdf.ln(5)

    # Details
    pdf.set_font("Arial", size=12)
    data_to_print = [
        f"Date/Time: {transaction_details.get('trans_date_trans_time')}",
        f"Merchant: {transaction_details.get('merchant')}",
        f"Amount: ${transaction_details.get('amt')}",
        f"Category: {transaction_details.get('category')}",
        f"City Population: {transaction_details.get('city_pop')}",
        f"Job: {transaction_details.get('job')}",
        f"Distance: {transaction_details.get('dist', 'N/A')}",
    ]

    for line in data_to_print:
        pdf.cell(0, 10, line, 0, 1)
    
    pdf.ln(5)
    
    # Risk Assessment
    pdf.set_font("Arial", 'B', 14)
    if transaction_details.get('is_fraud'):
        pdf.set_text_color(255, 0, 0)
        status = "FRAUD DETECTED"
    else:
        pdf.set_text_color(0, 128, 0)
        status = "SAFE / LOW RISK"
    
    pdf.cell(0, 10, f"Assessment: {status}", 0, 1)
    pdf.set_text_color(0, 0, 0) # Reset
    
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, f"Risk Score: {transaction_details.get('risk_score', 0) * 100:.2f}%", 0, 1)

    pdf.ln(10)
    pdf.multi_cell(0, 10, "Explanation:\nThis transaction was flagged based on patterns including high transaction amount, location mismatch, or unusual merchant category compared to historical profile.")

    # Save to file
    filename = f"report_{transaction_details.get('id', 'temp')}.pdf"
    filepath = os.path.join(os.path.dirname(__file__), 'artifacts', filename)
    pdf.output(filepath)
    return filepath
