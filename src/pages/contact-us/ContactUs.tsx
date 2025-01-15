import { FC } from "react";
import { DefaultLayout } from 'layouts';
import style from './contactUs.module.scss';
import { Formik, FieldProps, Field, } from 'formik';
import { Input, InputField, Textarea} from "components";
import * as Yup from 'yup';

import bgLogo from 'assets/contact-us/bg-logo.svg?url';
import bgLogoInverted from 'assets/contact-us/bg-logo-inverted.svg?url';
import contactUsPerson from 'assets/contact-us/contact-us-person.png';
import envelopecheck from 'assets/contact-us/envelope-check.svg?url';
import phonecall from 'assets/contact-us/phonecall.svg?url';
import paperPlane from 'assets/contact-us/paper-plane.svg?url';

const ContactUs: FC = () => {
    const handleSubmit = ()=>{
        console.log('handleSubmit')
    }
    const handleChange = ()=>{
        console.log('handleSubmit')
    }
    return (
        <DefaultLayout>
            <div className={style['about-us-container']}>
                <div className={style['form-container-wrapper']}>
                    <div className={style['form-container']}>
                        <div className={style['form-header']}>
                            <div>Get in touch</div>
                            <div>
                                <div>Have questions or feedback? We’re here to help!</div>
                                <div>Send us a message and we’ll get back to you within 24 hours</div>
                            </div>
                        </div>
                        <Formik
                            initialValues={{
                            cardNumber: '',
                            firstName: '',
                            lastName: '',
                            emailAddress: '',
                            message: '',
                            subject: ''
                        }}
                        validationSchema={Yup.object({
                            firstName: Yup.string()
                            .matches(/^[a-zA-Z\s]+$/, 'First name must only contain letters and spaces')
                            .required('First name is required'),
                            lastName: Yup.string()
                            .matches(/^[a-zA-Z\s]+$/, 'Last name must only contain letters and spaces')
                            .required('Last name is required'),
                            emailAddress: Yup.string()
                            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
                            .required('ExpiryDate is required'),
                            message: Yup.string()
                            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
                            .required('ExpiryDate is required'),
                            subject: Yup.string()
                            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
                            .required('ExpiryDate is required'),
                        })}
                        onSubmit={handleSubmit}
                        >
                                {({ errors, touched, handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                    <div className={style['form-body']}>
                                        <div className={style['firstname-lastname']}>
                                            <div>
                                            <InputField
                                                variant={'secondary'}
                                                label="First Name"
                                                className="bg-transparent"
                                                error={errors.firstName}
                                                touched={touched.firstName}
                                                showIcon={false}
                                                showAlertIcon={false}
                                                tooltipContent="N/A"
                                            >
                                                <Field name="firstName">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                    {...field} // Spread field props
                                                    placeholder="First Name"
                                                    className="bg-transparent border-[#000] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const value = event.target.value;
                                                        form.setFieldValue(field.name, value);
                                                    }}
                                                    onBlur={() => {
                                                        form.validateField(field.name);
                                                    }}
                                                    />
                                                )}
                                                </Field>
                                            </InputField>
                                            </div>
                                            <div>
                                            <InputField
                                                variant={'secondary'}
                                                label="Last Name"
                                                className="bg-transparent"
                                                error={errors.lastName}
                                                touched={touched.lastName}
                                                showIcon={false}
                                                showAlertIcon={false}
                                                tooltipContent="N/A"
                                            >
                                                <Field name="lastName">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                    {...field} // Spread field props
                                                    placeholder="Last Name"
                                                    className="bg-transparent border-[#000] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const value = event.target.value;
                                                        form.setFieldValue(field.name, value);
                                                    }}
                                                    onBlur={() => {
                                                        form.validateField(field.name);
                                                    }}
                                                    />
                                                )}
                                                </Field>
                                            </InputField>
                                            </div>
                                        </div>
                                        <div>
                                        <InputField
                                                variant={'secondary'}
                                                label="Email Address"
                                                className="bg-transparent mt-4"
                                                error={errors.emailAddress}
                                                touched={touched.emailAddress}
                                                showIcon={false}
                                                showAlertIcon={false}
                                                tooltipContent="N/A"
                                            >
                                                <Field name="lastName">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                    {...field} // Spread field props
                                                    placeholder="Last Name"
                                                    className="bg-transparent border-[#000] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const value = event.target.value;
                                                        form.setFieldValue(field.name, value);
                                                    }}
                                                    onBlur={() => {
                                                        form.validateField(field.name);
                                                    }}
                                                    />
                                                )}
                                                </Field>
                                            </InputField>
                                        </div>
                                        <div className={style['radio-group-container']}>
                                            <div className={style['radio-group-title']}>What best describes you?</div>
                                            <div className={style['radio-group-selections']}>
                                                <div>
                                                    <input type="radio" id="jobhunter" name="userType" value="Job Hunter" checked />
                                                    <label htmlFor="jobhunter">Job Hunter</label>
                                                </div>

                                                <div>
                                                    <input type="radio" id="employer" name="userType" value="Employer" />
                                                    <label htmlFor="employer">Employer</label>
                                                </div>

                                                <div>
                                                    <input type="radio" id="preferNotToSay" name="userType" value="louie" />
                                                    <label htmlFor="preferNotToSay">Prefer not to say</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            
                                        <InputField
                                                variant={'secondary'}
                                                label="Subject"
                                                className="bg-transparent mt-2"
                                                error={errors.subject}
                                                touched={touched.subject}
                                                showIcon={false}
                                                showAlertIcon={false}
                                                tooltipContent="N/A"
                                            >
                                                <Field name="subject">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                    {...field} // Spread field props
                                                    placeholder="Subject"
                                                    className="bg-transparent border-[#000] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const value = event.target.value;
                                                        form.setFieldValue(field.name, value);
                                                    }}
                                                    onBlur={() => {
                                                        form.validateField(field.name);
                                                    }}
                                                    />
                                                )}
                                                </Field>
                                            </InputField>
                                        </div>
                                        <div>
                                        <InputField
                                            label="Leave us a message"
                                            variant={'secondary'}
                                            error={errors.message}
                                            touched={touched.message}
                                            className="mt-4"
                                        >
                                            <Textarea
                                            name="companyOverview"
                                            onChange={handleChange}
                                            className="bg-transparent border-[#000] h-[100px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                            placeholder="Leave us a message"
                                            />
                                        </InputField>
                                        </div>
                                        <div className={style['maximum-words']}>Maximum of 500 words</div>
                                        <div className={style['form-button-submit-wrapper']}>
                                            <button type="submit">
                                                <img src={paperPlane}/>
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                    </form>
                                )}
                        </Formik>
                    </div>
                </div>
                <div className={style['contact-details-container-wrapper']}>
                    <div className={style['contact-details-container']}>
                        <div className={style['contact-us-bg']}>
                            <img src={bgLogo}/>
                        </div>
                        <div className={style['contact-us-bg-inverted']}>
                            <img src={bgLogoInverted}/>
                        </div>
                        <div className={style['contact-us-person']}>
                            <img src={contactUsPerson}/>
                        </div>
                        <div className={style['contact-us-details-body']}>
                            <div className={style['contact-us-details-item']}>
                                <div><img src={envelopecheck}/></div>
                                <div><u>support@akaza.io</u></div>
                            </div>
                            <div className={style['contact-us-details-item']}>
                                <div><img src={phonecall}/></div>
                                <div>+1 (365) 340-3326</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export { ContactUs }