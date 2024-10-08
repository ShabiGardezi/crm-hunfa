import {
  Grid,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import MuiTable from 'src/layouts/components/tables/MuiTable'
import ViewHostingFormDialog from 'src/layouts/components/dialogs/ViewHostingFormDialog'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Icon as MuiIcon } from '@mui/material'
import UpdateHostingFormDialog from 'src/layouts/components/dialogs/UpdateHostingFormDialog'
import DeleteIcon from '@mui/icons-material/Delete'

// import UpdateDomainFormDialog from 'src/layouts/components/dialogs/UpdateDomainFormDialog'

type HostingFormType = {
  _id?: string
  creationDate: string
  hostingName: string
  hostingHolder: string
  hostingPlatform: string
  expirationDate: string
  price: string
  live_status: string
  list_status: string
  notes: string
  hostingApprovedBy: string
  business: string
}

const HostingForm = () => {
  const [data, setData] = useState<HostingFormType[]>([])
  const [selectedHostingId, setSelectedHostingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [businesses, setBusinesses] = useState<{ _id: string; business_name: string }[]>([]) // Added businesses state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  const handleDeleteHost = async () => {
    try {
      await axios.delete(`/api/hosting-forms/delete?_id=${selectedHostingId}`, {
        headers: { authorization: localStorage.getItem('token') }
      })
      toast.success('Host deleted successfully')
      fetchHostingForms()
    } catch (error) {
      console.error('Error deleting host:', error)
      toast.error('Failed to delete host')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedHostingId(null)
    }
  }

  // Define handleUpdateHostinginForm
  const handleUpdateHostingForm = (updatedHosting: HostingFormType) => {
    setData(prevData => prevData.map(hosting => (hosting._id === updatedHosting._id ? updatedHosting : hosting)))
    toast.success('Domain updated successfully')
    fetchHostingForms()
  }

  const columns = useMemo(
    () => [
      {
        header: 'Creation Date',
        accessorKey: 'creation_date',
        Cell: ({ cell }: any) => {
          const value = cell.getValue()

          return value ? new Date(value).toLocaleDateString() : ''
        }
      },
      {
        header: 'Hosting Name',
        accessorKey: 'hosting_name'
      },
      {
        header: 'Expiration Date',
        accessorKey: 'expiration_date',
        Cell: ({ cell }: any) => {
          const value = cell.getValue()

          return value ? new Date(value).toLocaleDateString() : ''
        }
      },
      {
        header: 'Price',
        accessorKey: 'price'
      },
      {
        header: 'Status',
        accessorKey: 'live_status'
      },
      {
        header: 'List Status',
        accessorKey: 'list_status'
      },
      {
        header: 'Hosting Holder',
        accessorKey: 'hosting_holder'
      },
      {
        header: 'Hosting Platform',
        accessorKey: 'hosting_platform'
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        Cell: ({ cell }: any) => {
          const { _id } = cell.row.original

          return (
            <Box alignItems={'center'} display={'flex'}>
              <MuiIcon
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedHostingId(_id)
                  setDialogOpen(true)
                }}
              >
                <VisibilityIcon />
              </MuiIcon>
              <UpdateHostingFormDialog
                updatedHosting={cell.row.original}
                handleUpdateHostingForm={handleUpdateHostingForm}
              />
              <MuiIcon
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => {
                  setSelectedHostingId(_id)
                  setDeleteDialogOpen(true)
                }}
              >
                <DeleteIcon />
              </MuiIcon>
            </Box>
          )
        }
      }
    ],
    []
  )

  const methods = useForm({
    defaultValues: {
      creationDate: dayjs().format('YYYY-MM-DD'),
      hostingName: '',
      hostingHolder: '',
      hostingPlatform: '',
      expirationDate: dayjs().format('YYYY-MM-DD'),
      price: '',
      live_status: 'Live',
      list_status: 'Listed',
      notes: '',
      hostingApprovedBy: '',
      business: ''
    }
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = methods

  const onSubmit = async (data: HostingFormType) => {
    const apiUrl = '/api/hosting-forms/create'

    const requestData = {
      creation_date: data.creationDate,
      hosting_name: data.hostingName,
      hosting_holder: data.hostingHolder,
      hosting_platform: data.hostingPlatform,
      expiration_date: data.expirationDate,
      price: data.price,
      live_status: data.live_status,
      list_status: data.list_status,
      hostingApprovedBy: data.hostingApprovedBy,
      notes: data.notes,
      business: data.business // Include selected business ID
    }

    await axios
      .post(apiUrl, requestData, { headers: { authorization: localStorage.getItem('token') } })
      .then(() => {
        toast.success('Hosting created successfully')
        methods.reset()
        fetchHostingForms()
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const fetchHostingForms = async () => {
    try {
      const response = await axios.get('/api/hosting-forms/get-all', {
        headers: { authorization: localStorage.getItem('token') }
      })
      setData(response.data.payload.hostingForms)
    } catch (error) {
      console.error('Error fetching hosting forms:', error)
    }
  }

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('/api/business/get-all-names', {
        headers: { authorization: localStorage.getItem('token') }
      })
      setBusinesses(response.data.payload.businesses)
    } catch (error) {
      console.error('Error fetching businesses:', error)
    }
  }

  useEffect(() => {
    fetchHostingForms()
    fetchBusinesses()
  }, [])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Hosting Form For Websites</h1>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <InputLabel>Business Name</InputLabel>
                <Controller
                  name='business'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Business Name'>
                      {businesses.map(business => (
                        <MenuItem key={business._id} value={business._id}>
                          {business.business_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='hostingName'
                  control={control}
                  rules={{ required: 'Hosting Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Hosting Name'
                      error={Boolean(errors.hostingName)}
                      helperText={errors.hostingName ? errors.hostingName.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='creationDate'
                  control={control}
                  rules={{ required: 'Creation Date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='date'
                      label='Creation Date'
                      InputLabelProps={{
                        shrink: true
                      }}
                      error={Boolean(errors.creationDate ? errors.creationDate.message : '')}
                      helperText={errors.creationDate ? errors.creationDate.message : ''}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='expirationDate'
                  control={control}
                  rules={{ required: 'Expiration Date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Expiration Date'
                      type='date'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.expirationDate)}
                      helperText={errors.expirationDate ? errors.expirationDate.message : ''}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='price'
                  control={control}
                  rules={{ required: 'Price is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Price'
                      type='number'
                      error={Boolean(errors.price)}
                      helperText={errors.price ? errors.price.message : ''}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Controller
                  name='live_status'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Status' defaultValue='Live'>
                      <MenuItem value='Live'>Live</MenuItem>
                      <MenuItem value='NotLive'>Not Live</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <InputLabel>List Status</InputLabel>
                <Controller
                  name='list_status'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='List Status' defaultValue='Listed'>
                      <MenuItem value='Listed'>Listed</MenuItem>
                      <MenuItem value='NotListed'>Not Listed</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='hostingApprovedBy'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Hosting Approved By'
                      error={Boolean(errors.hostingApprovedBy)}
                      helperText={errors.hostingApprovedBy ? errors.hostingApprovedBy.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>{' '}
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='hostingHolder'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Hosting Holder'
                      error={Boolean(errors.hostingHolder)}
                      helperText={errors.hostingHolder ? errors.hostingHolder.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>{' '}
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='hostingPlatform'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Hosting Platform'
                      error={Boolean(errors.hostingPlatform)}
                      helperText={errors.hostingPlatform ? errors.hostingPlatform.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='notes'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Notes'
                      error={Boolean(errors.notes)}
                      helperText={errors.notes ? errors.notes.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <Button type='submit' variant='contained' color='primary' fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      <MuiTable columns={columns} data={data} />
      {selectedHostingId && (
        <>
          <ViewHostingFormDialog _id={selectedHostingId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Delete Host</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Are you sure you want to delete this hosting? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
                Cancel
              </Button>
              <Button onClick={handleDeleteHost} color='primary' autoFocus>
                Yes, Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {selectedHostingId && (
        <ViewHostingFormDialog _id={selectedHostingId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
      )}
    </>
  )
}

export default HostingForm
