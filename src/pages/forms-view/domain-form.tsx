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
import ViewDomainFormDialog from 'src/layouts/components/dialogs/ViewDomainFormDialog'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Icon as MuiIcon } from '@mui/material'
import UpdateDomainFormDialog from 'src/layouts/components/dialogs/UpdateDomainFormDialog'
import DeleteIcon from '@mui/icons-material/Delete'

type DomainFormType = {
  _id?: string
  creationDate: string
  domainName: string
  domainHolder: string
  domainPlatform: string
  expirationDate: string
  price: string
  live_status: string
  list_status: string
  notes: string
  domainApprovedBy: string
  business: string // Added business field
}

const DomainForm = () => {
  const [data, setData] = useState<DomainFormType[]>([])
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [businesses, setBusinesses] = useState<{ _id: string; business_name: string }[]>([]) // Added businesses state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  const handleDeleteDomain = async () => {
    try {
      await axios.delete(`/api/domain-forms/delete?_id=${selectedDomainId}`, {
        headers: { authorization: localStorage.getItem('token') }
      })
      toast.success('Domain deleted successfully')
      fetchDomainForms()
    } catch (error) {
      console.error('Error deleting domain:', error)
      toast.error('Failed to delete domain')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedDomainId(null)
    }
  }

  // Define handleUpdateDomainForm
  const handleUpdateDomainForm = (updatedDomain: DomainFormType) => {
    setData(prevData => prevData.map(domain => (domain._id === updatedDomain._id ? updatedDomain : domain)))
    toast.success('Domain updated successfully')
    fetchDomainForms()
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
        header: 'Domain Name',
        accessorKey: 'domain_name'
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
        header: 'Domain Holder',
        accessorKey: 'domain_holder'
      },
      {
        header: 'Domain Platform',
        accessorKey: 'domain_platform'
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
                  setSelectedDomainId(_id)
                  setDialogOpen(true)
                }}
              >
                <VisibilityIcon />
              </MuiIcon>
              <UpdateDomainFormDialog
                updatedDomain={cell.row.original}
                handleUpdateDomainForm={handleUpdateDomainForm}
              />
              <MuiIcon
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => {
                  setSelectedDomainId(_id)
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
      domainName: '',
      domainHolder: '',
      domainPlatform: '',
      expirationDate: dayjs().format('YYYY-MM-DD'),
      price: '',
      live_status: 'Live',
      list_status: 'Listed',
      notes: '',
      domainApprovedBy: '',
      business: '' // Added business default value
    }
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = methods

  const onSubmit = async (data: DomainFormType) => {
    const apiUrl = '/api/domain-forms/create'

    const requestData = {
      creation_date: data.creationDate,
      domain_name: data.domainName,
      domain_holder: data.domainHolder,
      domain_platform: data.domainPlatform,
      expiration_date: data.expirationDate,
      price: data.price,
      live_status: data.live_status,
      list_status: data.list_status,
      domainApprovedBy: data.domainApprovedBy,
      notes: data.notes,
      business: data.business // Include selected business ID
    }

    await axios
      .post(apiUrl, requestData, { headers: { authorization: localStorage.getItem('token') } })
      .then(() => {
        toast.success('Domain created successfully')
        methods.reset()
        fetchDomainForms()
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const fetchDomainForms = async () => {
    try {
      const response = await axios.get('/api/domain-forms/get-all', {
        headers: { authorization: localStorage.getItem('token') }
      })
      setData(response.data.payload.domainForms)
    } catch (error) {
      console.error('Error fetching domain forms:', error)
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
    fetchDomainForms()
    fetchBusinesses() // Fetch businesses on component mount
  }, [])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Domain Form For Websites</h1>
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
                  name='domainName'
                  control={control}
                  rules={{ required: 'Domain Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Domain Name'
                      error={Boolean(errors.domainName)}
                      helperText={errors.domainName ? errors.domainName.message : ''}
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
                  name='domainApprovedBy'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Domain Approved By'
                      error={Boolean(errors.domainApprovedBy)}
                      helperText={errors.domainApprovedBy ? errors.domainApprovedBy.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>{' '}
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='domainHolder'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Domain Holder'
                      error={Boolean(errors.domainHolder)}
                      helperText={errors.domainHolder ? errors.domainHolder.message : ''}
                    />
                  )}
                ></Controller>
              </FormControl>
            </Grid>{' '}
            <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
              <FormControl fullWidth>
                <Controller
                  name='domainPlatform'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Domain Platform'
                      error={Boolean(errors.domainPlatform)}
                      helperText={errors.domainPlatform ? errors.domainPlatform.message : ''}
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
      {selectedDomainId && (
        <>
          <ViewDomainFormDialog _id={selectedDomainId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Delete Domain</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Are you sure you want to delete this domain? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
                Cancel
              </Button>
              <Button onClick={handleDeleteDomain} color='primary' autoFocus>
                Yes, Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {selectedDomainId && (
        <ViewDomainFormDialog _id={selectedDomainId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
      )}
    </>
  )
}

export default DomainForm
