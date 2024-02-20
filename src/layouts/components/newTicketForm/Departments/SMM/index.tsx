import React from 'react'
import FormsHeader from '../../Header'
import Customer from '../../SharedField/Customer'
import SaleDepartment from '../../SharedField/SaleDepartment'
import Review from '../../SharedField/Review'
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import SubmitButton from '../../SharedField/FormButton'
import BusinessDetail from '../LocalSeo/LocalSeoSpecificDetails'
import BusinessDetails from '../../SharedField/BusinessDetails'
import TicketDetails from '../../SharedField/TicketDetails'
import SocialMediaSpecificDetails from './SocialMediaSpecificDetails'

const SmmForm = () => {
  return (
    <>
      <Card>
        <CardHeader
          title={
            <Typography variant='h5' color={'primary'}>
              Generate New Ticket For Social Media / Customer Reviews Management
            </Typography>
          }
        />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          <Stack spacing={6}>
            <FormsHeader title='Business Details'>
              <BusinessDetails />
            </FormsHeader>

            <FormsHeader title='Sale Department'>
              <SaleDepartment />
            </FormsHeader>

            <FormsHeader title='Ticket Details'>
              <TicketDetails />
            </FormsHeader>

            <FormsHeader title='Department Specific Details'>
              <SocialMediaSpecificDetails />
            </FormsHeader>
          </Stack>

          <Box sx={{ my: '2rem ' }} />

          <SubmitButton beforeText='Submit' afterText='Submitting' fullWidth variant='contained' />
        </CardContent>
      </Card>
    </>
  )
}

export default SmmForm
