// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { MenuItem, Select } from '@mui/material'
import { Department, DepartmentValues } from 'src/shared/enums/Department.enum'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { SaleEmployeeRoleValues, UserRole, UserRoleValues } from 'src/shared/enums/UserRole.enum'
import axios from 'axios'

interface State {
  password: string
  showPassword: boolean
}

interface FormInputs {
  user_name: string
  password: string
  department: string
  role: string
  sub_role: string
}

const defaultValues = {
  user_name: '',
  password: '',
  department: '',
  role: '',
  sub_role: ''
}

const validationSchema = yup.object({
  user_name: yup
    .string()
    .required('Username is required')
    .matches(
      /^[a-zA-Z0-9_-]{3,20}$/,
      'Invalid username. Only alphanumeric characters, underscores, and hyphens are allowed (3-20 characters)'
    ),
  password: yup.string().required('Password is required'),
  department: yup.string().required('Department is required'),
  role: yup.string().required('Role is required'),
  sub_role: yup.string().when('department', {
    is: (val: any) => val === Department.Sales,
    then: schema => yup.string().required('Sub Role is required'),
    otherwise: schema => yup.string()
  })
})

const FormValidationAsync = () => {
  // ** States
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<State>({
    password: '',
    showPassword: false
  })

  // ** Hook
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, resolver: yupResolver(validationSchema), mode: 'onChange' })

  const department = watch('department')

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  const onSubmit = async (data: FormInputs) => {
    console.log(loading)
    if (loading) return
    try {
      setLoading(true)
      const res = await axios.post(
        '/api/user/create',
        {
          user_name: data.user_name,
          password: data.password,
          role: data.role,
          department_name: data.department,
          sub_role: data.sub_role
        },
        { headers: { authorization: localStorage.getItem('token') } }
      )
      toast.success('User created successfully')
      reset(defaultValues)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Create New User' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='user_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='text'
                      value={value}
                      label='Username'
                      onChange={onChange}
                      error={Boolean(errors.user_name)}
                      aria-describedby='validation-async-email'
                    />
                  )}
                />
                {errors.user_name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-email'>
                    {errors.user_name.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='validation-async-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label='Password'
                      onChange={onChange}
                      id='validation-async-password'
                      error={Boolean(errors.password)}
                      type={state.showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon icon={state.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-password'>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.department)} htmlFor='validation-basic-select'>
                  Department
                </InputLabel>
                <Controller
                  name='department'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='Department'
                      onChange={e => {
                        setValue('role', '')
                        onChange(e)
                      }}
                      error={Boolean(errors.department)}
                      labelId='validation-basic-select'
                      aria-describedby='validation-basic-select'
                    >
                      {DepartmentValues.map(d => {
                        return (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  )}
                />
                {errors.department && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                    {errors.department.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.role)} htmlFor='validation-role-select'>
                  Role
                </InputLabel>
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      disabled={department ? false : true}
                      label='Role'
                      onChange={onChange}
                      error={Boolean(errors.role)}
                      labelId='validation-role-select'
                      aria-describedby='validation-role-select'
                    >
                      {UserRoleValues.map(d => {
                        const departmentValue = getValues('department')
                        if (departmentValue === Department.Sales) if (!(d === UserRole.SALE_EMPLOYEE)) return

                        if (departmentValue !== Department.Sales && departmentValue !== Department.Admin)
                          if (d === UserRole.SALE_EMPLOYEE || d === UserRole.ADMIN) return

                        if (departmentValue === Department.Admin) if (!(d === UserRole.ADMIN)) return
                        return (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  )}
                />
                {errors.role && <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {getValues('department') === Department.Sales && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.sub_role)} htmlFor='validation-sub-role-select'>
                    Sub Role
                  </InputLabel>
                  <Controller
                    name='sub_role'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label='Sub Role'
                        onChange={onChange}
                        error={Boolean(errors.sub_role)}
                        labelId='validation-sub-role-select'
                        aria-describedby='validation-sub-role-select'
                      >
                        {SaleEmployeeRoleValues.map(d => {
                          return (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    )}
                  />
                  {errors.sub_role && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.sub_role.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained'>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Create User
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationAsync