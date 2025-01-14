import { FC } from "react";
import { DefaultLayout } from 'layouts';
import style from './contactUs.module.scss';
import { Formik, FieldProps, Field, } from 'formik';
import { Input, InputField} from "components";
import * as Yup from 'yup';

import contactUsPerson from 'assets/contact-us/contact-us-person.png'
import envelopecheck from 'assets/contact-us/envelope-check.svg?url'
import phonecall from 'assets/contact-us/phonecall.svg?url'
const ContactUs: FC = () => {
    const handleSubmit = ()=>{
        console.log('handleSubmit')
    }
    return (
        <DefaultLayout>
            <div className={style['about-us-container']}>
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
                                className="bg-transparent mt-2"
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
                                    className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                                className="bg-transparent mt-2"
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
                                    className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                                className="bg-transparent mt-2"
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
                                    className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                        <div>Subject</div>
                        <div>Leave us a message</div>
                        <div>Maximum of 500 words</div>
                        <div>
                            <button type="submit">Send</button>
                        </div>
                    </div>
                    </form>
                )}
                    </Formik>
                </div>
                <div className={style['contact-details-container']}>
                    <div className={style.contactUsPerson}>
                        <img src={contactUsPerson}/>
                    </div>
                    <div className={style['contact-us-details-body']}>
                        <div className={style['contact-us-details-item']}>
                            <div><img src={envelopecheck}/></div>
                            <div>support@akaza.io</div>
                        </div>
                        <div className={style['contact-us-details-item']}>
                            <div><img src={phonecall}/></div>
                            <div>+1 (365) 340-3326</div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export { ContactUs }