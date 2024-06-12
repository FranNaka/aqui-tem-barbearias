import Scheduler from 'devextreme-react/scheduler';
import { locale } from 'devextreme/localization';
import { ArrowLeftCircle, CloudUpload, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Col from '../components/Col';
import FormContainer from '../components/FormContainer';
import InputText from '../components/InputText';
import Row from '../components/Row';
import Selectpicker from '../components/Selectpicker';
import { useForm } from 'react-hook-form';
import { editAgenda, listAgenda, saveAgenda } from '../services/agenda';
import { Switch, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { listService } from '../services/service';
import Header from '../components/Header';

const currentDate = new Date();
const views = ['agenda', 'day'];

export default function AgendaPage() {
    const [abrirModalAgendamento, setAbrirModalAgendamento] = useState(false);
    const [agendas, setAgendas] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('usuario');
        if (user !== null || user !== undefined) {
          navigate("/login")
        }
    }, [])

    const Appointment = (e) => {
        let findAgenda = agendas.find(i => i.id === e.data.targetedAppointmentData.assigneeId) || {};        
        const [agenda, setAgenda] = useState(findAgenda); 

        const onChangePay = async () => {
            try {
                // Alterar o valor de pago
                const newAgenda = {
                    ...agenda,
                    pago: !agenda.pago,
                    ativo: agenda.ativo.toString()
                };

                // Atualizar o estado com o novo valor de pago
                setAgenda(newAgenda);

                // Enviar a solicitação para editar a agenda com o novo valor de pago
                const res = await editAgenda(findAgenda.id, { ...newAgenda, pago: newAgenda.pago.toString() });


                if (newAgenda.pago) {
                    notification.success({
                        message: "Sucesso ao pagar",
                        description: res.mensagem
                    });
                }
                setAgenda(newAgenda);

            } catch (error) {
                notification.warning({
                    message: "Error",
                    description: "Ocorreu um erro inesperado"
                })
            }
        };

        return (
            <div className='flex flex-row'>
                <div>
                    <div className="dx-scheduler-appointment-title">{findAgenda.nomeDoCliente}</div>
                    <div className="dx-scheduler-appointment-content-details">
                        <div className="dx-scheduler-appointment-content-date">Horario {findAgenda.horario}</div>
                        <div className="dx-scheduler-appointment-content-date pl-2">Duração {findAgenda.duracao}</div>
                        <div className="dx-scheduler-appointment-content-date pl-2">{findAgenda.nome}</div>
                    </div>
                </div>
                <div className="dx-scheduler-agenda-appointment-right-layout">
                    Pago? <Switch defaultChecked={agenda.pago} onChange={onChangePay} className='h-6' />
                </div>
            </div>
        );
    };


    const onAppointmentFormOpening = (e) => { // quando a edição de agenda estiver pronto retornar isso
        let findAgenda = agendas.find(i => i.id === e.appointmentData.assigneeId) || {};
        e.form.option('items', [
            {
                label: {
                    text: 'Cliente',
                },
                editorType: 'dxTextBox',
                dataField: 'nomeDoCliente',
                editorOptions: {
                    width: '100%',
                    type: 'text',
                    valueExpr: 'nomeDoCliente',
                    value: findAgenda.nomeDoCliente,
                },
            },
            {
                label: {
                    text: 'Serviços',
                },
                editorType: 'dxTextBox',
                dataField: 'servico',
                editorOptions: {
                    width: '100%',
                    valueExpr: 'servico',
                    value: findAgenda.servico,
                },
            },
            {
                name: 'Dia',
                dataField: 'dia',
                editorType: 'dxDateBox',
                editorOptions: {
                    width: '100%',
                    type: 'date',
                    valueExpr: 'data',
                    value: findAgenda.data
                },
            },
            {
                name: 'Horario',
                dataField: 'horario',
                className: 'w-full',
                editorType: 'dxDateBox',
                editorOptions: {
                    // width: '100%',
                    type: 'time',
                    valueExpr: 'horario',
                    value: findAgenda.horario,

                },
            },
            {
                name: 'Descrição (Opcional)',
                dataField: 'descricao',
                editorType: 'dxTextBox',
                editorOptions: {
                    width: '100%',
                    type: 'text',
                    valueExpr: 'descricao',
                    value: findAgenda.descricao
                },
            }
        ]);
    };

    const handleNovoAgendamento = () => {
        setAbrirModalAgendamento(true);
    }

    const onAppointmentFormDelete = async (e) => {
        let findAgenda = agendas.find(i => i.id === e.appointmentData.assigneeId) || {};
        try {
            // Alterar o valor de pago
            const newAgenda = {
                ...findAgenda,
                ativo: (!findAgenda.ativo).toString(),
                pago: findAgenda.pago.toString(),
            };


            // Enviar a solicitação para editar a agenda com o novo valor de pago
            const res = await editAgenda(findAgenda.id, newAgenda);

            if (newAgenda.pago) {
                notification.success({
                    message: "Sucesso ao apagar",
                    description: res.mensagem
                });
            }
        } catch (error) {
            notification.warning({
                message: "Error",
                description: "Ocorreu um erro inesperado"
            })
        }
    }

    const onAppointmentUpdated = async (e) => {
        let findAgenda = agendas.find(i => i.id === e.appointmentData.assigneeId) || {};
        try {
            const { nomeDoCliente, servico, descricao, ativo, pago, preco, duracao, horario, dia } = e.component._editAppointmentData
            // Alterar o valor de pago
            const newAgenda = {
                ...findAgenda,
                nomeDoCliente: nomeDoCliente,
                servico: servico,
                descricao: descricao,
                ativo: findAgenda.ativo.toString(),
                pago: findAgenda.pago.toString(),
                preco: preco.toString(),
                duracao: duracao,
                horario: horario,
                data: dia
            };


            // // Enviar a solicitação para editar a agenda com o novo valor de pago
            const res = await editAgenda(findAgenda.id, newAgenda);

            if (newAgenda.pago) {
                notification.success({
                    message: "Sucesso ao Editar",
                    description: res.mensagem
                });
            }
        const updatedAgendas = agendas.map((item) => (item.id === newAgenda.id ? newAgenda : item));
        setAgendas(updatedAgendas);

        } catch (error) {
            notification.warning({
                message: "Error",
                description: "Ocorreu um erro inesperado"
            })
        }
    }
    //appointmentData.assigneeId
    // setando o local como brasil
    useEffect(() => {
        (async () => {
            try {
                const data = await listAgenda()
                setAgendas(data.dados)
            } catch (error) {
                notification.success({
                    message: "Sucesso ao apagar",
                    description: "Não foi possivel listar os agendamentos"
                });
            }
        })()
        locale('pt-BR')
    }, []);

    // a altura da agenda, sera o tamanho da tela do usuario -150 pixels
    const height = window.innerHeight - 150;

    // função para calcular a data final com base na data e hora de início e na duração
    function calcularEndDate(data, horario, duracao = '1:00') {
        const [horasInicio, minutosInicio] = horario.split(':').map(Number);
        const [ano, mes, dia] = data.split('-').map(Number); // Ajustando para o formato 'AAAA-MM-DD'

        const dataInicio = new Date(ano, mes - 1, dia, horasInicio, minutosInicio);

        // Separando a duração em horas e minutos
        const [horasDuracao, minutosDuracao] = duracao.split(':').map(Number);

        // Calculando o tempo total em minutos
        const totalMinutos = horasDuracao * 60 + minutosDuracao;

        // Adicionando os minutos de duração ao horário de início
        const endDate = new Date(dataInicio.getTime() + totalMinutos * 60 * 1000);

        return endDate;
    }



    return (
        <>
            <div className='w-full flex flex-col justify-center h-dvh bg-[#242222]'>
                <Header />
                    <div className='flex flex-col justify-center'>
                        <div className='bg-white w-full p-1 flex flex-col justify-center items-center text-3xl font-semibold rounded-t-md'>
                            <div>Agenda</div>
                            <Button
                                variant="icon"
                                icon={<Plus />}
                                onClick={handleNovoAgendamento}
                            />

                        </div>
                        <div className='w-full h-full bg-white rounded-b-md'>
                            <Scheduler
                                timeZone="America/Sao_Paulo"

                                dataSource={agendas?.map(compromisso => {
                                    return {
                                        text: compromisso.servico,
                                        startDate: new Date(compromisso.data + 'T' + compromisso.horario),
                                        endDate: calcularEndDate(compromisso.data, compromisso.horario, compromisso.duracao),
                                        assigneeId: compromisso.id, // ou qualquer outra propriedade que desejar usar

                                        priorityId: 1 // ou qualquer outra propriedade que desejar usar
                                    };
                                })}
                                views={views}
                                currentView="agenda"
                                defaultCurrentDate={currentDate}
                                height={height}
                                appointmentComponent={Appointment}
                                onAppointmentDeleted={onAppointmentFormDelete}
                                onAppointmentFormOpening={onAppointmentFormOpening}
                                onAppointmentUpdated={onAppointmentUpdated}
                            />
                        </div>
                    </div>
            </div>
            {abrirModalAgendamento && (
                <ModalAgendamento
                    onClose={() => { setAbrirModalAgendamento(false) }}
                />
            )}
        </>

    )
}

const ModalAgendamento = ({ onClose }) => {
    // trazendo as operações de formulário da biblioteca hook form
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [servicos, setServicos] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const { dados } = await listService()
                setServicos(dados)
            } catch (error) {
                notification.warning({
                    message: "Error",
                    description: "Ocorreu um erro inesperado"
                })
            }
        })()
        locale('pt-BR')
    }, []);

    const onSubmit = async (data) => {
        try {
            const res = await saveAgenda(data)
            notification.success({
                message: "Sucesso",
                description: res.mensagem
            })
            setTimeout(() => {
                return navigate(0)
            }, 1000)
        } catch (error) {
            notification.warning({
                message: "Error",
                description: "Ocorreu um erro inesperado"
            })
        }
    }

    return (
        <dialog
            className='w-fit fixed top-1/2 bottom-1/2 z-10 bg-gray-50 shadow-sm shadow-[#242222] rounded-md p-2'
            open="true"
        >
            <div className='w-full flex items-center gap-4 mb-2 justify-between'>
                <div className='text-lg font-semibold capitalize'>
                    Novo agendamento
                </div>
                <div
                    className='p-0.5 cursor-pointer transition-colors rounded-full hover:bg-gray-100'
                    onClick={onClose}
                >
                    <X className='text-gray-500' />
                </div>
            </div>
            <FormContainer variant="modal">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Row>
                        <Col>
                            <InputText
                                type="text"
                                label="Cliente"
                                placeholder="Digite o nome do Cliente"
                                {...register("nomeDoCliente")}
                                errors={errors.nomeDoCliente}
                            />
                        </Col>
                        <Selectpicker
                            label="Serviços"
                            {...register("servico", { required: "Campo obrigatório" })}
                        >
                            {servicos.map(e =>
                                <option value={e.id}>{e.nome}</option>
                            )}
                        </Selectpicker>
                    </Row>
                    <Row>
                        <Col>
                            <InputText
                                type="date"
                                className="w-full"
                                label="Dia"
                                inputMode="numeric"
                                {...register("data", {
                                    required: "Campo obrigatório"
                                })}
                                errors={errors.data}
                            />
                        </Col>
                        <Col>
                            <InputText
                                type="time"
                                className="w-full"
                                label="Horario"
                                inputMode="numeric"
                                {...register("horario", {
                                    required: "Campo obrigatório",
                                    min: {
                                        value: 0,
                                        message: "Digite uma duração válida"
                                    }
                                })}
                                errors={errors.horario}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputText
                                type="text"
                                label="Observação (opcional)"
                                placeholder="Alguma observação para este agendamento"
                                {...register("descricao")}
                                errors={errors.descricao}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            variant={"full"}
                        >
                            <div
                                className="flex gap-4 justify-end"
                            >
                                <Button
                                    variant="gray"
                                    type="button"
                                    icon={<ArrowLeftCircle className="me-1" />}
                                    onClick={onClose}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    type="submit"
                                    icon={<CloudUpload className='me-1' />}
                                >
                                    Salvar
                                </Button>

                            </div>
                        </Col>
                    </Row>
                </form>

            </FormContainer>
        </dialog>
    )
}