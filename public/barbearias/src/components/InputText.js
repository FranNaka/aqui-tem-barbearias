
import React from 'react';

// importando a função que deixa adicionar classes personalizadas além do que ja foi definido aqui
import { cn } from '../utils/cn';
import { cva } from 'class-variance-authority';

// componente input de texto
// parametros obrigatorios: label, type (tipo do input), placeholder
// ...props são as propriedades padrão de input, pra caso precise por nas aplicações ele nao dar erro
// intent é qual tipo de classe vai ser usada
const InputText = ({ intent, label, type, placeholder, className, icon, ...props }) => {
    return (
        <div>
            <label
                className="font-semibold text-sm"
            >
                {label}
            </label>
            <input
                className={inputVariants({
                    className,
                    intent
                })}
                placeholder={placeholder}
                type={type}
                {...props}
            />
            {icon && icon}
        </div>
    )
}

// definindo css dinamico pro InputText
const inputVariants = cva(
    // Primeiro começamos com o css base que vai ter em todo input
    "w-full border border-[#242222] rounded-sm p-1 text-[#242222] outline-none",
    {
        // caso tenha variantes de estilo, adicionar aqui
        variants: {
            intent: {
                icone: "w-5/6"
            }
        }
    }
)



// exporta o componente pra todos os arquivos do sistema ver
export default InputText;
