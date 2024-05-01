import { SocialMediaFormType } from 'src/interfaces/forms.interface'

export const mapResponseForSocialMedia = (data: any): SocialMediaFormType => {
  return {
    business: {
      business_name: data.business_id.business_name,
      business_email: data.business_id.business_email,
      business_number: data.business_id.business_number,
      business_hours: data.business_id.business_hours,
      state: data.business_id.state,
      country: data.business_id.country,
      zip_code: data.business_id.zip_code,
      street: data.business_id.street,
      website_url: data.business_id.website_url,
      social_profile: data.business_id.social_profile,
      gmb_url: data.business_id.gmb_url,
      client_name: data.business_id.client_name
    },
    saleDepart: {
      fronter: data.fronter,
      fronter_id: data.fronter_id,
      closer: data.closer,
      closer_id: data.closer_id,
      sale_type: data.sales_type
    },
    ticketDetails: {
      priority: data.priority,
      remaining_price_date: data.remaining_price_date ? new Date(data.remaining_price_date) : null,

      // due_date: new Date(data.due_date),
      total_payment: 0,
      advance_payment: 0,
      remaining_payment: 0,
      client_reporting_date: data.client_reporting_date ? new Date(data.client_reporting_date) : null,
      ticket_notes: data.ticket_notes
    },
    socialMediaFormTypeDetails: {
      service_name: data?.service_name,
      facebook_url: data?.facebook_url,
      login_credentials: data?.login_credentials,
      notes: data?.notes,
      work_status: data?.work_status,
      platform_name: data?.platform_name,
      no_of_likes: data?.no_of_likes,
      no_of_gmb_reviews: data?.no_of_gmb_reviews,
      no_of_posts: data?.no_of_posts
    }
  }
}
