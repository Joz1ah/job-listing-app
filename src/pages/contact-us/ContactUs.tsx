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
    const handleSubmit = (e:any)=>{
        console.log(e)
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
                            firstName: '',
                            lastName: '',
                            emailAddress: '',
                            userType: 'Job Hunter',
                            message: '',
                            subject: ''
                        }}
                        validationSchema={Yup.object({
                            firstName: Yup.string()
                                .matches(/^[a-zA-Z\s]+$/, 'Only letters and spaces')
                                .required('First name is required'),
                            lastName: Yup.string()
                                .matches(/^[a-zA-Z\s]+$/, 'Only letters and spaces')
                                .required('Last name is required'),
                            emailAddress: Yup.string()
                                .matches(
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                'Please enter a valid email address'
                                )
                                .required('Email address is required'),
                            userType: Yup.string()
                                .oneOf(['Job Hunter', 'Employer', 'Prefer not to say'], 'Please select a valid option')
                                .required('User type is required'),    
                            message: Yup.string()
                                .min(10, 'Message must be at least 10 characters long')
                                .required('Message is required'),
                            subject: Yup.string()
                                .min(3, 'Subject must be at least 3 characters long')
                                .required('Subject is required'),
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
                                                showAlertIcon={true}
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
                                                showAlertIcon={true}
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
                                                showAlertIcon={true}
                                                tooltipContent="N/A"
                                            >
                                                <Field name="emailAddress">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                    {...field} // Spread field props
                                                    placeholder="Email Address"
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
                                            <Field name="userType">
                                                {({ field, form }: FieldProps) => (
                                                <>
                                                    <div className={style['custom-radio']}>
                                                    <input
                                                        type="radio"
                                                        id="jobhunter"
                                                        {...field}
                                                        value="Job Hunter"
                                                        checked={field.value === 'Job Hunter'}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = event.target.value;
                                                            form.setFieldValue(field.name, value);
                                                        }}
                                                    />
                                                    <label htmlFor="jobhunter">Job Hunter</label>
                                                    </div>

                                                    <div className={style['custom-radio']}>
                                                    <input
                                                        type="radio"
                                                        id="employer"
                                                        {...field}
                                                        value="Employer"
                                                        checked={field.value === 'Employer'}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = event.target.value;
                                                            form.setFieldValue(field.name, value);
                                                        }}
                                                    />
                                                    <label htmlFor="employer">Employer</label>
                                                    </div>

                                                    <div className={style['custom-radio']}>
                                                    <input
                                                        type="radio"
                                                        id="preferNotToSay"
                                                        {...field}
                                                        value="Prefer not to say"
                                                        checked={field.value === 'Prefer not to say'}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = event.target.value;
                                                            form.setFieldValue(field.name, value);
                                                        }}
                                                    />
                                                    <label htmlFor="preferNotToSay">Prefer not to say</label>
                                                    </div>
                                                </>
                                                )}
                                            </Field>

                                            </div>
                                            {touched.userType && errors.userType && (
                                                <div className={style['error']}>{errors.userType}</div>
                                            )}
                                        </div>
                                        <div>
                                        <InputField
                                                variant={'secondary'}
                                                label="Subject"
                                                className="bg-transparent mt-2"
                                                error={errors.subject}
                                                touched={touched.subject}
                                                showIcon={false}
                                                showAlertIcon={true}
                                                tooltipContent="N/A"
                                            >
                                                <Field name="subject">
                                                {({ field, form }: FieldProps) => (
                                                    <Input
                                                    {...field} 
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
                                                variant={'secondary'}
                                                label="Message"
                                                className="bg-transparent mt-2"
                                                error={errors.message}
                                                touched={touched.message}
                                                showIcon={false}
                                                showAlertIcon={true}
                                                tooltipContent="N/A"
                                            >
                                                
                                            <Field name="message">
                                            {({ field, form }: FieldProps) => (
                                                <Textarea
                                                {...field} 
                                                name="message"
                                                placeholder="Leave us a message"
                                                className="bg-transparent border-[#000] h-[100px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
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