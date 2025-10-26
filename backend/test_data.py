# generate_sample_paystub.py
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime

OUTFILE = "sample_paystub_test.pdf"

def draw_watermark(c, text="SAMPLE — FOR TESTING ONLY — NOT VALID"):
    c.saveState()
    c.setFont("Helvetica-Bold", 40)
    c.setFillColorRGB(0.85, 0.85, 0.85)  # light grey
    c.translate(300, 400)
    c.rotate(45)
    c.drawCentredString(0, 0, text)
    c.restoreState()

def draw_header(c):
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, 730, "SAMPLE PAYSTUB (FOR TESTING ONLY)")
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.red)
    c.drawString(40, 714, "THIS DOCUMENT IS A SYNTHETIC TEST FIXTURE — NOT FOR OFFICIAL USE")

def draw_employer_employee_block(c):
    # Employer info
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.black)
    c.drawString(40, 690, "Employer:")
    c.setFont("Helvetica", 10)
    c.drawString(110, 690, "Acme Freelance Services (Sample)")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, 674, "Employer EIN (SIM):")
    c.setFont("Helvetica", 10)
    c.drawString(140, 674, "00-0000000")

    # Employee info
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, 650, "Employee:")
    c.setFont("Helvetica", 10)
    c.drawString(110, 650, "Alex Morgan (SAMPLE)")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, 634, "Employee ID:")
    c.setFont("Helvetica", 10)
    c.drawString(110, 634, "EMP-000123 (TEST)")

def draw_pay_period_block(c):
    c.setFont("Helvetica-Bold", 10)
    c.drawString(360, 690, "Pay Period:")
    c.setFont("Helvetica", 10)
    c.drawString(440, 690, "2024-03-01 to 2024-03-31")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(360, 674, "Pay Date:")
    c.setFont("Helvetica", 10)
    c.drawString(440, 674, "2024-04-01")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(360, 658, "Check / Trans ID:")
    c.setFont("Helvetica", 10)
    c.drawString(480, 658, "CHK-TEST-20240331")

def draw_earnings_table(c):
    x = 40
    y = 590
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x, y+20, "EARNINGS")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x, y, "Description")
    c.drawString(280, y, "Hours/Qty")
    c.drawString(360, y, "Rate")
    c.drawString(430, y, "Current")
    c.drawString(500, y, "YTD")
    c.setLineWidth(0.5)
    c.line(x, y-2, 560, y-2)

    c.setFont("Helvetica", 9)
    rows = [
        ("Regular Hours", "80.00", "$25.00", "$2,000.00", "$22,000.00"),
        ("Project Bonus (one-off)", "1", "-", "$8,000.00", "$8,000.00"),
        ("Overtime", "0.00", "$0.00", "$0.00", "$0.00"),
    ]
    yy = y - 18
    for desc, qty, rate, cur, ytd in rows:
        c.drawString(x, yy, desc)
        c.drawRightString(310, yy, qty)
        c.drawRightString(400, yy, rate)
        c.drawRightString(480, yy, cur)
        c.drawRightString(560, yy, ytd)
        yy -= 14

def draw_deductions_and_totals(c):
    x = 40
    y = 490
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x, y+20, "DEDUCTIONS")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x, y, "Description")
    c.drawString(360, y, "Current")
    c.drawString(430, y, "YTD")
    c.line(x, y-2, 560, y-2)

    c.setFont("Helvetica", 9)
    rows = [
        ("Federal Tax (FIT)", "$600.00", "$6,600.00"),
        ("State Tax (SIT)", "$150.00", "$1,650.00"),
        ("Social Security", "$124.00", "$1,364.00"),
        ("Medicare", "$29.00", "$319.00"),
        ("Other Deductions", "$0.00", "$0.00"),
    ]
    yy = y - 18
    for desc, cur, ytd in rows:
        c.drawString(x, yy, desc)
        c.drawRightString(480, yy, cur)
        c.drawRightString(560, yy, ytd)
        yy -= 14

    # Totals box
    total_gross = "$10,000.00"
    total_deductions = "$903.00"
    net_pay = "$9,097.00"

    box_x = 360
    box_y = 420
    c.setFont("Helvetica-Bold", 10)
    c.drawString(box_x, box_y + 60, "Totals")
    c.setFont("Helvetica", 10)
    c.drawString(box_x, box_y + 42, f"Gross Pay: {total_gross}")
    c.drawString(box_x, box_y + 26, f"Total Deductions: {total_deductions}")
    c.drawString(box_x, box_y + 10, f"Net Pay: {net_pay}")

def draw_additional_info(c):
    x = 40
    y = 380
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y+20, "PAY DETAILS")
    c.setFont("Helvetica", 9)
    c.drawString(x, y, "Declared monthly income (self-reported): $3,000 (SAMPLE)")
    c.drawString(x, y-14, "Payment cadence claimed: Biweekly (14 days)")
    c.drawString(x, y-28, "Account Last4: 4321 (TEST)")

    c.drawString(x, y-56, "Notes:")
    c.setFont("Helvetica", 8)
    c.drawString(x+10, y-70, "This is synthetic data intended for testing only. Values are fictional.")
    c.drawString(x+10, y-84, "Do not use this document for any real-world verification or submission.")

def draw_footer(c):
    c.setFont("Helvetica", 7)
    c.setFillColor(colors.grey)
    c.drawString(40, 40, "Generated: {} — SAMPLE DOCUMENT — NOT FOR OFFICIAL USE".format(datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")))

def create_paystub_pdf(outfile=OUTFILE):
    c = canvas.Canvas(outfile, pagesize=letter)
    # Watermark first (so it's behind main content visually, we'll draw then set transparency)
    draw_watermark(c)
    draw_header(c)
    draw_employer_employee_block(c)
    draw_pay_period_block(c)
    draw_earnings_table(c)
    draw_deductions_and_totals(c)
    draw_additional_info(c)
    draw_footer(c)
    c.showPage()
    c.save()
    print(f"Saved sample paystub to {outfile}")

if __name__ == "__main__":
    create_paystub_pdf()
