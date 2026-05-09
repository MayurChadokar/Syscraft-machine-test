const getRegistrationTemplate = (userName, eventName, surveyLink) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
    <h2 style="color: #0284c7;">Registration Successful!</h2>
    <p>Hi <b>${userName}</b>,</p>
    <p>You have successfully registered for the event: <b style="color: #0284c7;">${eventName}</b>.</p>
    <p>Please complete the feedback survey using the button below to receive your official certificate of participation.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${surveyLink}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Complete Survey</a>
    </div>
    <p style="color: #64748b; font-size: 14px;">If the button doesn't work, copy and paste this link: <br/> ${surveyLink}</p>
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 EventHub Management System</p>
</div>
`;

const getCertificateTemplate = (userName, eventName) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
    <h2 style="color: #0284c7;">Your Certificate is Ready!</h2>
    <p>Hi <b>${userName}</b>,</p>
    <p>Thank you for participating in <b style="color: #0284c7;">${eventName}</b> and providing your valuable feedback.</p>
    <p>Your official <b>Certificate of Participation</b> is attached to this email as a PDF.</p>
    <p>We look forward to seeing you at our future events!</p>
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 EventHub Management System</p>
</div>
`;

module.exports = { getRegistrationTemplate, getCertificateTemplate };
